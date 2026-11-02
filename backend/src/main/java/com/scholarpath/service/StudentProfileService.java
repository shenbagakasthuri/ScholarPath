package com.scholarpath.service;

import com.scholarpath.dto.StudentProfileRequest;
import com.scholarpath.dto.StudentProfileResponse;
import com.scholarpath.entity.StudentProfile;
import com.scholarpath.entity.User;
import com.scholarpath.exception.ResourceNotFoundException;
import com.scholarpath.repository.StudentProfileRepository;
import com.scholarpath.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentProfileService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;

    public StudentProfileService(UserRepository userRepository, StudentProfileRepository studentProfileRepository) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getCurrentUserProfile() {
        Long currentUserId = getCurrentUserId();
        StudentProfile profile = studentProfileRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for current user"));
        return toResponse(profile);
    }

    @Transactional
    public StudentProfileResponse updateCurrentUserProfile(StudentProfileRequest request) {
        Long currentUserId = getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentProfile profile = studentProfileRepository.findByUserId(currentUserId)
                .orElseGet(() -> {
                    StudentProfile newProfile = new StudentProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        profile.setUser(user);
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender());
        profile.setCategory(request.getCategory());
        profile.setSubCategory(request.getSubCategory());
        profile.setDisabilityType(request.getDisabilityType());
        profile.setDisabilityPercentage(request.getDisabilityPercentage());
        profile.setAnnualFamilyIncome(request.getAnnualFamilyIncome());
        profile.setIncomeCertificateNumber(request.getIncomeCertificateNumber());
        profile.setIncomeCertificateDate(request.getIncomeCertificateDate());
        profile.setDomicileState(request.getDomicileState());
        profile.setDomicileDistrict(request.getDomicileDistrict());
        profile.setDomicileCertificateNumber(request.getDomicileCertificateNumber());
        profile.setAadhaarNumber(request.getAadhaarNumber());
        profile.setBankAccountNumber(request.getBankAccountNumber());
        profile.setBankIfscCode(request.getBankIfscCode());
        profile.setBankAccountHolderName(request.getBankAccountHolderName());

        StudentProfile savedProfile = studentProfileRepository.save(profile);
        return toResponse(savedProfile);
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new IllegalStateException("No authenticated user found");
        }
        try {
            return Long.parseLong(authentication.getName());
        } catch (NumberFormatException ex) {
            throw new IllegalStateException("Authenticated principal is not a valid user id");
        }
    }

    private StudentProfileResponse toResponse(StudentProfile profile) {
        StudentProfileResponse response = new StudentProfileResponse();
        response.setId(profile.getId());
        response.setUserId(profile.getUser() != null ? profile.getUser().getId() : null);
        response.setDateOfBirth(profile.getDateOfBirth());
        response.setGender(profile.getGender());
        response.setCategory(profile.getCategory());
        response.setSubCategory(profile.getSubCategory());
        response.setDisabilityType(profile.getDisabilityType());
        response.setDisabilityPercentage(profile.getDisabilityPercentage());
        response.setAnnualFamilyIncome(profile.getAnnualFamilyIncome());
        response.setIncomeCertificateNumber(profile.getIncomeCertificateNumber());
        response.setIncomeCertificateDate(profile.getIncomeCertificateDate());
        response.setDomicileState(profile.getDomicileState());
        response.setDomicileDistrict(profile.getDomicileDistrict());
        response.setDomicileCertificateNumber(profile.getDomicileCertificateNumber());
        response.setAadhaarNumber(profile.getAadhaarNumber());
        response.setBankAccountNumber(profile.getBankAccountNumber());
        response.setBankIfscCode(profile.getBankIfscCode());
        response.setBankAccountHolderName(profile.getBankAccountHolderName());
        return response;
    }
}
