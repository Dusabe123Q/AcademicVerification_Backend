package com.dusabe.service;

import com.dusabe.entity.Alumni;
import com.dusabe.entity.Notification;
import com.dusabe.entity.Student;
import com.dusabe.enums.StudentStatus;
import com.dusabe.repository.AlumniRepository;
import com.dusabe.repository.NotificationRepository;
import com.dusabe.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class GraduationService {

    private final StudentRepository studentRepository;
    private final AlumniRepository alumniRepository;
    private final NotificationRepository notificationRepository;

    private final com.dusabe.repository.AuditLogRepository auditLogRepository;

    public GraduationService(StudentRepository studentRepository, 
                             AlumniRepository alumniRepository, 
                             NotificationRepository notificationRepository,
                             com.dusabe.repository.AuditLogRepository auditLogRepository) {
        this.studentRepository = studentRepository;
        this.alumniRepository = alumniRepository;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public Alumni graduateStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getStatus() != StudentStatus.STUDENT) {
            throw new RuntimeException("Student is already graduated or alumni");
        }

        // 1. Update Student status
        student.setStatus(StudentStatus.GRADUATE);
        studentRepository.save(student);

        // 2. Create Alumni Profile
        Alumni alumni = new Alumni();
        alumni.setStudent(student);
        alumni.setName(student.getName());
        alumni.setEmail(student.getEmail());
        alumni.setPhone(student.getPhone());
        alumni.setGrad_year(LocalDate.now().getYear());
        alumni.setCareer_info("New Graduate");
        
        Alumni savedAlumni = alumniRepository.save(alumni);

        // 3. Send Notification if user exists
        if (student.getAlumni() != null && student.getAlumni().getUser() != null) {
            Notification notification = new Notification(
                student.getAlumni().getUser(),
                "Congratulations! You have been graduated. Your Alumni profile is now active."
            );
            notificationRepository.save(notification);
        }

        auditLogRepository.save(new com.dusabe.entity.AuditLog("STUDENT_GRADUATION", "Student " + student.getName() + " has been migrated to Alumni Ledger."));

        return savedAlumni;
    }
}
