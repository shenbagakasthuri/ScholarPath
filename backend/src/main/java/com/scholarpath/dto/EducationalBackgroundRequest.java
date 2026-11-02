package com.scholarpath.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class EducationalBackgroundRequest {

    @NotBlank(message = "Level is required")
    @Size(max = 50, message = "Level must be at most 50 characters")
    private String level;

    @NotBlank(message = "Institution name is required")
    @Size(max = 255, message = "Institution name must be at most 255 characters")
    private String institutionName;

    @Size(max = 255, message = "Board or university must be at most 255 characters")
    private String boardUniversity;

    @Size(max = 255, message = "Course name must be at most 255 characters")
    private String courseName;

    @Size(max = 100, message = "Stream must be at most 100 characters")
    private String stream;

    @Min(value = 1900, message = "Year of passing must be at least 1900")
    @Max(value = 2100, message = "Year of passing must be at most 2100")
    private Integer yearOfPassing;

    @DecimalMin(value = "0.00", inclusive = true, message = "Percentage/CGPA must be zero or greater")
    @DecimalMax(value = "100.00", inclusive = true, message = "Percentage/CGPA must be 100 or lower")
    private BigDecimal percentageCgpa;

    @NotNull(message = "Current status is required")
    private Boolean isCurrent;

    @Size(max = 500, message = "Marksheet URL must be at most 500 characters")
    private String marksheetUrl;
}
