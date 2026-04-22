package com.dusabe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    
    @NotBlank(message = "Username cannot be empty")
    @Size(min = 4, message = "Username must be at least 4 characters long")
    private String username;
    
    private String password;
    
    private String email;
    private String phone;
    
    @NotBlank(message = "Role must be specified: ADMIN, ALUMNI, or EMPLOYER")
    private String role; // Expecting "ADMIN", "ALUMNI", "EMPLOYER"

    public RegisterRequest() {}

    public RegisterRequest(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
