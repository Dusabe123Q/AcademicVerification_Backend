package com.dusabe.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping("/")
    public String welcome() {
        return "welcome";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/verify")
    public String verify() {
        return "verify";
    }

    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "admin/dashboard";
    }

    @GetMapping("/admin/students")
    public String adminStudents() {
        return "admin/students";
    }

    @GetMapping("/admin/credentials")
    public String adminCredentials() {
        return "admin/credentials";
    }

    @GetMapping("/admin/logs")
    public String adminLogs() {
        return "admin/logs";
    }

    @GetMapping("/alumni/dashboard")
    public String alumniDashboard() {
        return "alumni/dashboard";
    }

    @GetMapping("/alumni/employment")
    public String alumniEmployment() {
        return "alumni/employment";
    }
}
