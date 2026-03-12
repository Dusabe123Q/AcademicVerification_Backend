package com.dusabe.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "credential")
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long credential_id;

    private String credential_type;

    private LocalDate issue_date;

    @Column(unique = true)
    private String serial_number;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @OneToMany(mappedBy = "credential")
    private List<Verification> verifications;

    public Credential() {}

    public Long getCredential_id() {
        return credential_id;
    }

    public void setCredential_id(Long credential_id) {
        this.credential_id = credential_id;
    }

    public String getCredential_type() {
        return credential_type;
    }

    public void setCredential_type(String credential_type) {
        this.credential_type = credential_type;
    }

    public LocalDate getIssue_date() {
        return issue_date;
    }

    public void setIssue_date(LocalDate issue_date) {
        this.issue_date = issue_date;
    }

    public String getSerial_number() {
        return serial_number;
    }

    public void setSerial_number(String serial_number) {
        this.serial_number = serial_number;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public List<Verification> getVerifications() {
        return verifications;
    }

    public void setVerifications(List<Verification> verifications) {
        this.verifications = verifications;
    }
}