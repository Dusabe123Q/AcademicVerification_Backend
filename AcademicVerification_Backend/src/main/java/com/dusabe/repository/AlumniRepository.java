package com.dusabe.repository;

import com.dusabe.entity.Alumni;
import com.dusabe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlumniRepository extends JpaRepository<Alumni, Long> {
    Optional<Alumni> findByUserUsername(String username);
    Optional<Alumni> findByUser(User user);
}