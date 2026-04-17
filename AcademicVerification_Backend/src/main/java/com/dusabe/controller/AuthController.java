package com.dusabe.controller;

import com.dusabe.dto.AuthResponse;
import com.dusabe.dto.LoginRequest;
import com.dusabe.dto.OtpRequest;
import com.dusabe.dto.RegisterRequest;
import com.dusabe.dto.VerifyOtpAndRegisterRequest;
import com.dusabe.entity.Alumni;
import com.dusabe.entity.User;
import com.dusabe.enums.Role;
import com.dusabe.repository.AlumniRepository;
import com.dusabe.repository.UserRepository;
import com.dusabe.security.JwtService;
import com.dusabe.service.EmailService;
import com.dusabe.service.OtpService;
import com.dusabe.service.SmsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final OtpService otpService;
    private final EmailService emailService;
    private final SmsService smsService;
    private final AlumniRepository alumniRepository;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          AuthenticationManager authenticationManager,
                          UserDetailsService userDetailsService,
                          OtpService otpService,
                          EmailService emailService,
                          SmsService smsService,
                          AlumniRepository alumniRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.otpService = otpService;
        this.emailService = emailService;
        this.smsService = smsService;
        this.alumniRepository = alumniRepository;
    }

    // ─── Step 1: Send OTP to email or phone ──────────────────────────────────
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@Valid @RequestBody OtpRequest request) {
        try {
            String email = request.getEmail();
            String phone = request.getPhone();
            String method = request.getPreferredMethod();

            boolean hasEmail = email != null && !email.isBlank();
            boolean hasPhone = phone != null && !phone.isBlank();

            if (!hasEmail && !hasPhone) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Either email or phone must be provided."));
            }

            if (method == null || method.isBlank()) {
                if (hasEmail && hasPhone) method = "both";
                else method = hasEmail ? "email" : "sms";
            }

            boolean sendEmail = (method.equalsIgnoreCase("email") || method.equalsIgnoreCase("both")) && hasEmail;
            boolean sendSms = (method.equalsIgnoreCase("sms") || method.equalsIgnoreCase("both")) && hasPhone;

            if (!sendEmail && !sendSms) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid delivery method for provided contact info."));
            }

            String primaryContact = hasEmail ? email : phone;
            String otp = otpService.generateAndStore(primaryContact);

            if (sendEmail) {
                emailService.sendOtpEmail(email, otp);
            }
            if (sendSms) {
                smsService.sendOtpSms(phone, otp);
            }

            return ResponseEntity.ok(Map.of("message", "OTP sent successfully."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send OTP. Details: " + e.getMessage()));
        }
    }

    // ─── Step 2: Verify OTP and create account ───────────────────────────────
    @PostMapping("/verify-and-register")
    public ResponseEntity<?> verifyAndRegister(@Valid @RequestBody VerifyOtpAndRegisterRequest request) {
        String email = request.getEmail();
        String phone = request.getPhone();
        boolean hasEmail = email != null && !email.isBlank();
        boolean hasPhone = phone != null && !phone.isBlank();

        if (!hasEmail && !hasPhone) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Email or phone must be provided."));
        }

        String primaryContact = hasEmail ? email : phone;

        // Verify OTP
        if (!otpService.verify(primaryContact, request.getOtp())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid or expired OTP. Please try again."));
        }

        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already exists. Please choose another."));
        }

        // Determine role
        Role userRole;
        try {
            userRole = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            userRole = Role.ALUMNI;
        }

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                userRole
        );
        if(hasEmail) user.setEmail(email);
        if(hasPhone) user.setPhone(phone);
        User savedUser = userRepository.save(user);

        // If role is Alumni, create an Alumni profile record automatically
        if (userRole == Role.ALUMNI) {
            Alumni alumni = new Alumni();
            alumni.setUser(savedUser);
            alumni.setName(savedUser.getUsername());
            if(hasEmail) alumni.setEmail(email);
            if(hasPhone) alumni.setPhone(phone);
            alumniRepository.save(alumni);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String jwtToken = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwtToken));
    }

    // ─── Original register (keep for admin use) ───────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        Role userRole;
        try {
            userRole = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            userRole = Role.ALUMNI;
        }

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                userRole
        );
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String jwtToken = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwtToken));
    }

    // ─── Login ────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String jwtToken = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwtToken));
    }
}