package com.dusabe.service;

import com.dusabe.entity.User;
import com.dusabe.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public User saveUser(User user){
        return repository.save(user);
    }

    public Optional<User> findByUsername(String username){
        return repository.findByUsername(username);
    }
}