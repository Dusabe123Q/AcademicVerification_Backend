package com.dusabe.repository;

import com.dusabe.entity.Verification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface VerificationRepository extends JpaRepository<Verification, Long> {

    @Query("SELECT v FROM Verification v WHERE (:status IS NULL OR v.status = :status) AND (:year IS NULL OR YEAR(v.request_date) = :year)")
    List<Verification> searchVerifications(@Param("status") String status, @Param("year") Integer year);

    List<Verification> findByCredentialStudentAlumniUserUsername(String username);
}