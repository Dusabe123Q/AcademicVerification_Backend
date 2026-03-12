package com.dusabe.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "alumni")
public class Alumni {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alumni_id;

    private int grad_year;

    private String career_info;

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student;

    public Alumni() {}

    public Long getAlumni_id() {
        return alumni_id;
    }

    public void setAlumni_id(Long alumni_id) {
        this.alumni_id = alumni_id;
    }

    public int getGrad_year() {
        return grad_year;
    }

    public void setGrad_year(int grad_year) {
        this.grad_year = grad_year;
    }

    public String getCareer_info() {
        return career_info;
    }

    public void setCareer_info(String career_info) {
        this.career_info = career_info;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}