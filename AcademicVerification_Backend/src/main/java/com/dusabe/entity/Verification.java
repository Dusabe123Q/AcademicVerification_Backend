package com.dusabe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification")
public class Verification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long verification_id;

    private String status;

    private LocalDateTime request_date;

    @ManyToOne
    @JoinColumn(name = "credential_id")
    private Credential credential;

    public Verification() {
        this.request_date = LocalDateTime.now();
    }

    public Long getVerification_id() {
        return verification_id;
    }

    public void setVerification_id(Long verification_id) {
        this.verification_id = verification_id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRequest_date() {
        return request_date;
    }

    public void setRequest_date(LocalDateTime request_date) {
        this.request_date = request_date;
    }

    public Credential getCredential() {
        return credential;
    }

    public void setCredential(Credential credential) {
        this.credential = credential;
    }
}