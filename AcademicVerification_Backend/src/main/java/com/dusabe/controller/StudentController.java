package com.dusabe.controller;

import com.dusabe.entity.Student;
import com.dusabe.enums.StudentStatus;
import com.dusabe.service.GraduationService;
import com.dusabe.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/students")
@PreAuthorize("hasRole('ADMIN')")
public class StudentController {

    private final StudentService studentService;
    private final GraduationService graduationService;

    public StudentController(StudentService studentService, GraduationService graduationService) {
        this.studentService = studentService;
        this.graduationService = graduationService;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping
    public Student createStudent(@Valid @RequestBody Student student) {
        student.setStatus(StudentStatus.STUDENT);
        return studentService.saveStudent(student);
    }

    @GetMapping("/{id}")
    public Student getStudent(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    @PostMapping("/{id}/graduate")
    public ResponseEntity<?> graduate(@PathVariable Long id) {
        return ResponseEntity.ok(graduationService.graduateStudent(id));
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }
}