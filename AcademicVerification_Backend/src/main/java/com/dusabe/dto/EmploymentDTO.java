package com.dusabe.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class EmploymentDTO {

    private Long id;

    @NotBlank(message = "Employer is required")
    private String employer;

    @NotBlank(message = "Job Title is required")
    private String jobTitle;

    private LocalDate startDate;
    private LocalDate endDate;

    public EmploymentDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployer() {
        return employer;
    }

    public void setEmployer(String employer) {
        this.employer = employer;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
