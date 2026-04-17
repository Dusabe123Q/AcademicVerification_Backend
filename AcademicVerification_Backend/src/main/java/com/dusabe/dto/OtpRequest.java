package com.dusabe.dto;

import jakarta.validation.constraints.Email;

public class OtpRequest {

    @Email(message = "Please provide a valid email address")
    private String email;

    private String phone;
    
    private String preferredMethod;

    public OtpRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPreferredMethod() { return preferredMethod; }
    public void setPreferredMethod(String preferredMethod) { this.preferredMethod = preferredMethod; }
}
