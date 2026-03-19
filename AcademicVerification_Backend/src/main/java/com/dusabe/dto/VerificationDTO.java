package com.dusabe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VerificationDTO {

    @NotNull(message = "Credential ID is required")
    private Long credential_id;

    public VerificationDTO() {}

    public Long getCredential_id() {
        return credential_id;
    }

    public void setCredential_id(Long credential_id) {
        this.credential_id = credential_id;
    }
}
