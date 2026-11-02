package com.scholarpath.service;

import com.scholarpath.dto.EducationalBackgroundRequest;
import com.scholarpath.dto.EducationalBackgroundResponse;
import com.scholarpath.entity.EducationalBackground;
import com.scholarpath.entity.StudentProfile;
import com.scholarpath.exception.ResourceNotFoundException;
import com.scholarpath.repository.EducationalBackgroundRepository;
import com.scholarpath.repository.StudentProfileRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class EducationalBackgroundService {

    private final EducationalBackgroundRepository educationalBackgroundRepository;
    private final StudentProfileRepository studentProfileRepository;

    public EducationalBackgroundService(EducationalBackgroundRepository educationalBackgroundRepository,
                                       StudentProfileRepository studentProfileRepository) {
        this.educationalBackgroundRepository = educationalBackgroundRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    @Transactional
    public EducationalBackgroundResponse createEducationRecord(EducationalBackgroundRequest request) {
        StudentProfile profile = getCurrentStudentProfile();

        EducationalBackground education = new EducationalBackground();
        education.setStudentProfile(profile);
        applyRequest(education, request);

        EducationalBackground saved = educationalBackgroundRepository.save(education);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<EducationalBackgroundResponse> getCurrentUserEducationRecords() {
        StudentProfile profile = getCurrentStudentProfile();
        return educationalBackgroundRepository.findByStudentProfileId(profile.getId())
                .stream()
                .sorted(Comparator.comparing(EducationalBackground::getId))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public EducationalBackgroundResponse updateEducationRecord(Long educationId, EducationalBackgroundRequest request) {
        StudentProfile currentProfile = getCurrentStudentProfile();

        EducationalBackground education = educationalBackgroundRepository.findById(educationId)
                .orElseThrow(() -> new ResourceNotFoundException("Education record not found"));

        if (!education.getStudentProfile().getId().equals(currentProfile.getId())) {
            throw new AccessDeniedException("You do not have access to this education record");
        }

        applyRequest(education, request);
        EducationalBackground saved = educationalBackgroundRepository.save(education);
        return toResponse(saved);
    }

    private StudentProfile getCurrentStudentProfile() {
        Long currentUserId = getCurrentUserId();
        return studentProfileRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for current user"));
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

    private void applyRequest(EducationalBackground education, EducationalBackgroundRequest request) {
        education.setLevel(request.getLevel());
        education.setInstitutionName(request.getInstitutionName());
        education.setBoardUniversity(request.getBoardUniversity());
        education.setCourseName(request.getCourseName());
        education.setStream(request.getStream());
        education.setYearOfPassing(request.getYearOfPassing());
        education.setPercentageCgpa(request.getPercentageCgpa());
        education.setIsCurrent(Boolean.TRUE.equals(request.getIsCurrent()));
        education.setMarksheetUrl(request.getMarksheetUrl());
    }

    private EducationalBackgroundResponse toResponse(EducationalBackground education) {
        EducationalBackgroundResponse response = new EducationalBackgroundResponse();
        response.setId(education.getId());
        response.setStudentProfileId(education.getStudentProfile() != null ? education.getStudentProfile().getId() : null);
        response.setLevel(education.getLevel());
        response.setInstitutionName(education.getInstitutionName());
        response.setBoardUniversity(education.getBoardUniversity());
        response.setCourseName(education.getCourseName());
        response.setStream(education.getStream());
        response.setYearOfPassing(education.getYearOfPassing());
        response.setPercentageCgpa(education.getPercentageCgpa());
        response.setIsCurrent(education.getIsCurrent());
        response.setMarksheetUrl(education.getMarksheetUrl());
        return response;
    }
}
