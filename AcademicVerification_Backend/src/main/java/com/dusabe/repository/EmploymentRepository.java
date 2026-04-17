package com.dusabe.repository;

import com.dusabe.entity.Alumni;
import com.dusabe.entity.Employment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmploymentRepository extends JpaRepository<Employment, Long> {
    List<Employment> findByAlumni(Alumni alumni);
}
