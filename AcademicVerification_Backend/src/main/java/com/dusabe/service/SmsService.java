package com.dusabe.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    private static final Logger logger = LoggerFactory.getLogger(SmsService.class);

    public void sendOtpSms(String phone, String otp) {
        // Mock SMS Service for now.
        // In production, integrate with Twilio, AWS SNS, etc.
        logger.info("\n=======================================\n" +
                    "[MOCK SMS DISPATCH]\n" +
                    "To: {}\n" +
                    "Message: Hello! Your verification code is {}. It expires in 5 minutes.\n" +
                    "=======================================\n", phone, otp);
    }
}
