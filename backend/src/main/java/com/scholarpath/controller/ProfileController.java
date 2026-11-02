package com.scholarpath.controller;

import com.scholarpath.dto.StudentProfileRequest;
import com.scholarpath.dto.StudentProfileResponse;
import com.scholarpath.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final StudentProfileService studentProfileService;

    public ProfileController(StudentProfileService studentProfileService) {
        this.studentProfileService = studentProfileService;
    }

    @GetMapping
    public ResponseEntity<StudentProfileResponse> getCurrentProfile() {
        return ResponseEntity.ok(studentProfileService.getCurrentUserProfile());
    }

    @PutMapping
    public ResponseEntity<StudentProfileResponse> updateCurrentProfile(@Valid @RequestBody StudentProfileRequest request) {
        return ResponseEntity.ok(studentProfileService.updateCurrentUserProfile(request));
    }
}
