package com.dusabe.repository;

import com.dusabe.entity.Alumni;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlumniRepository extends JpaRepository<Alumni, Long> {
}