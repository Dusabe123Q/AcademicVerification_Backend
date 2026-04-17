package com.dusabe.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "alumni")
public class Alumni {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alumni_id;

    private Integer grad_year;
    private String career_info;
    private String name;
    private String email;
    private String phone;
    
    // New fields for Profile and Certificate
    private String profileImageUrl;
    private String certificateUrl;

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    // Employment tracking fields
    private String current_employer;
    private String position;

    @OneToMany(mappedBy = "alumni", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Employment> employmentHistory;

    public Alumni() {}

    public Long getAlumni_id() {
        return alumni_id;
    }

    public void setAlumni_id(Long alumni_id) {
        this.alumni_id = alumni_id;
    }

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getCertificateUrl() {
        return certificateUrl;
    }

    public void setCertificateUrl(String certificateUrl) {
        this.certificateUrl = certificateUrl;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public List<Employment> getEmploymentHistory() {
        return employmentHistory;
    }

    public void setEmploymentHistory(List<Employment> employmentHistory) {
        this.employmentHistory = employmentHistory;
    }
}