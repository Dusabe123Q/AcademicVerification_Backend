package com.dusabe.repository;

import com.dusabe.entity.Credential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface CredentialRepository extends JpaRepository<Credential, Long> {
    @Query("SELECT c FROM Credential c WHERE c.serial_number = :serialNumber")
    Optional<Credential> findBySerialNumber(@Param("serialNumber") String serialNumber);

    java.util.List<Credential> findByStudent(com.dusabe.entity.Student student);

}