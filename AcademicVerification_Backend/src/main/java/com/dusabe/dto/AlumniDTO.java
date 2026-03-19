package com.dusabe.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AlumniDTO {
    
    @NotNull(message = "Graduation year is required")
    @Min(value = 1900, message = "Graduation year is invalid")
    @Max(value = 2100, message = "Graduation year is invalid")
    private Integer grad_year;

    @NotBlank(message = "Career info is required")
    private String career_info;

    private String current_employer;
    private String position;
    
    private Long student_id; // Keeping logic simple to link a student

    public AlumniDTO() {}

    public Integer getGrad_year() {
        return grad_year;
    }

    public void setGrad_year(Integer grad_year) {
        this.grad_year = grad_year;
    }

    public String getCareer_info() {
        return career_info;
    }

    public void setCareer_info(String career_info) {
        this.career_info = career_info;
    }

    public String getCurrent_employer() {
        return current_employer;
    }

    public void setCurrent_employer(String current_employer) {
        this.current_employer = current_employer;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Long getStudent_id() {
        return student_id;
    }

    public void setStudent_id(Long student_id) {
        this.student_id = student_id;
    }
}
