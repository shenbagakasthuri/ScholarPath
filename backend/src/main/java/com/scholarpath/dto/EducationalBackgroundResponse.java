package com.scholarpath.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class EducationalBackgroundResponse {
    private Long id;
    private Long studentProfileId;
    private String level;
    private String institutionName;
    private String boardUniversity;
    private String courseName;
    private String stream;
    private Integer yearOfPassing;
    private BigDecimal percentageCgpa;
    private Boolean isCurrent;
    private String marksheetUrl;
}
