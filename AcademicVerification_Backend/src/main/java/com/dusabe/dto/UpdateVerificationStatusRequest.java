package com.dusabe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateVerificationStatusRequest {

    @NotBlank(message = "Status cannot be empty")
    @Pattern(regexp = "^(PENDING|APPROVED|REJECTED)$", message = "Invalid status. Use PENDING, APPROVED, or REJECTED")
    private String status;

    public UpdateVerificationStatusRequest() {}

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
