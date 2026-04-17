package com.dusabe.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final long EXPIRY_MINUTES = 10;

    private final SecureRandom random = new SecureRandom();

    // Map: contactInfo -> {otp, expiryTime}
    private final Map<String, OtpRecord> otpStore = new ConcurrentHashMap<>();

    public String generateAndStore(String contactInfo) {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        String otpCode = otp.toString();
        Instant expiry = Instant.now().plusSeconds(EXPIRY_MINUTES * 60);
        otpStore.put(contactInfo.toLowerCase(), new OtpRecord(otpCode, expiry));
        return otpCode;
    }

    public boolean verify(String contactInfo, String inputOtp) {
        OtpRecord record = otpStore.get(contactInfo.toLowerCase());
        if (record == null) return false;
        if (Instant.now().isAfter(record.expiry())) {
            otpStore.remove(contactInfo.toLowerCase());
            return false;
        }
        boolean matches = record.otp().equals(inputOtp);
        if (matches) {
            otpStore.remove(contactInfo.toLowerCase()); // consume OTP
        }
        return matches;
    }

    public boolean hasValidOtp(String contactInfo) {
        OtpRecord record = otpStore.get(contactInfo.toLowerCase());
        return record != null && Instant.now().isBefore(record.expiry());
    }

    private record OtpRecord(String otp, Instant expiry) {}
}
