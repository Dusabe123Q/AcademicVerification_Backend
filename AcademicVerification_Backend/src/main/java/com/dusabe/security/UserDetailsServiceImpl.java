package com.dusabe.security;

import com.dusabe.entity.User;
import com.dusabe.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        log.info("Attempting to load user by identifier: {}", identifier);
        
        // Find by Username (handle duplicates gracefully)
        List<User> usersByUsername = userRepository.findAllByUsername(identifier);
        User user = null;
        
        if (!usersByUsername.isEmpty()) {
            user = usersByUsername.get(0);
            log.info("User found by username: {} with role: {}", user.getUsername(), user.getRole());
        } else {
            // Find by Email (handle duplicates gracefully)
            log.info("User not found by username, checking email for: {}", identifier);
            List<User> usersByEmail = userRepository.findAllByEmail(identifier);
            if (!usersByEmail.isEmpty()) {
                user = usersByEmail.get(0);
                log.info("User found by email: {} with role: {}", user.getUsername(), user.getRole());
            }
        }

        if (user == null) {
            log.error("Authentication failed: User not found with username or email: {}", identifier);
            throw new UsernameNotFoundException("User not found with username or email: " + identifier);
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
