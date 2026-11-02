package com.scholarpath.controller;

import com.scholarpath.dto.EducationalBackgroundRequest;
import com.scholarpath.dto.EducationalBackgroundResponse;
import com.scholarpath.dto.StudentProfileRequest;
import com.scholarpath.dto.StudentProfileResponse;
import com.scholarpath.service.EducationalBackgroundService;
import com.scholarpath.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final StudentProfileService studentProfileService;
    private final EducationalBackgroundService educationalBackgroundService;

    public ProfileController(StudentProfileService studentProfileService,
                            EducationalBackgroundService educationalBackgroundService) {
        this.studentProfileService = studentProfileService;
        this.educationalBackgroundService = educationalBackgroundService;
    }

    @GetMapping
    public ResponseEntity<StudentProfileResponse> getCurrentProfile() {
        return ResponseEntity.ok(studentProfileService.getCurrentUserProfile());
    }

    @PutMapping
    public ResponseEntity<StudentProfileResponse> updateCurrentProfile(@Valid @RequestBody StudentProfileRequest request) {
        return ResponseEntity.ok(studentProfileService.updateCurrentUserProfile(request));
    }

    @PostMapping("/education")
    public ResponseEntity<EducationalBackgroundResponse> createEducationRecord(@Valid @RequestBody EducationalBackgroundRequest request) {
        EducationalBackgroundResponse response = educationalBackgroundService.createEducationRecord(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/education")
    public ResponseEntity<List<EducationalBackgroundResponse>> getEducationRecords() {
        return ResponseEntity.ok(educationalBackgroundService.getCurrentUserEducationRecords());
    }

    @PutMapping("/education/{id}")
    public ResponseEntity<EducationalBackgroundResponse> updateEducationRecord(@PathVariable Long id,
                                                                              @Valid @RequestBody EducationalBackgroundRequest request) {
        return ResponseEntity.ok(educationalBackgroundService.updateEducationRecord(id, request));
    }
}
