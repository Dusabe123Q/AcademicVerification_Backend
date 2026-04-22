package com.dusabe.service;

import com.dusabe.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import com.dusabe.entity.Student;

@Service
public class StudentService {

    private final StudentRepository repository;
    private final com.dusabe.repository.AuditLogRepository auditLogRepository;

    public StudentService(StudentRepository repository, com.dusabe.repository.AuditLogRepository auditLogRepository) {
        this.repository = repository;
        this.auditLogRepository = auditLogRepository;
    }

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public Student saveStudent(Student student) {
        Student saved = repository.save(student);
        auditLogRepository.save(new com.dusabe.entity.AuditLog("STUDENT_REGISTRATION", "New student registered: " + student.getName() + " (" + student.getRegistrationNumber() + ")"));
        return saved;
    }

    public Student getStudentById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = repository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
        student.setName(studentDetails.getName());
        student.setEmail(studentDetails.getEmail());
        student.setPhone(studentDetails.getPhone());
        student.setRegistrationNumber(studentDetails.getRegistrationNumber());
        student.setFaculty(studentDetails.getFaculty());
        student.setProgram(studentDetails.getProgram());
        student.setDob(studentDetails.getDob());
        
        Student updated = repository.save(student);
        auditLogRepository.save(new com.dusabe.entity.AuditLog("UPDATE_STUDENT", "Student identity updated: " + updated.getName()));
        return updated;
    }

    public void deleteStudent(Long id) {
        Student student = repository.findById(id).orElse(null);
        if (student != null) {
            String name = student.getName();
            repository.deleteById(id);
            auditLogRepository.save(new com.dusabe.entity.AuditLog("DELETE_STUDENT", "Student identity purged from registry: " + name));
        }
    }
}