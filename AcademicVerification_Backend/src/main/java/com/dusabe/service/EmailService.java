package com.dusabe.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendOtpEmail(String toEmail, String otp) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Your OTP Code – Academic Verification System");

        String htmlBody = """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                  <div style="background: linear-gradient(135deg, #059669 0%%, #10b981 100%%);\
                 padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Academic Verification</h1>
                    <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Green Token Verification</p>
                  </div>
                  <div style="background: #ffffff; padding: 40px 32px; border-radius: 0 0 12px 12px;\
                 border: 1px solid #e8e8e8; border-top: none;">
                    <p style="color: #4a5568; font-size: 16px; margin: 0 0 24px;">
                      Hello! Use the secure code below to complete your registration. It expires in <strong>10 minutes</strong>.
                    </p>
                    <div style="background: #ecfdf5; border: 2px dashed #059669; border-radius: 8px;\
                 padding: 28px; text-align: center; margin-bottom: 24px;">
                      <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #059669;">%s</span>
                    </div>
                    <p style="color: #718096; font-size: 13px; margin: 0;">
                      If you did not request this, please ignore this email.
                    </p>
                  </div>
                </div>
                """.formatted(otp);

        helper.setText(htmlBody, true);
        mailSender.send(message);
    }

    @Async
    public void sendVerificationStatusEmail(String toEmail, String status, String credentialSerial) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);

        boolean approved = "APPROVED".equalsIgnoreCase(status);
        String subject = approved
                ? "✅ Your Credential Verification was Approved – AcademiVerify"
                : "❌ Your Credential Verification was Rejected – AcademiVerify";

        helper.setSubject(subject);

        String color = approved ? "#38a169" : "#e53e3e";
        String icon  = approved ? "✅" : "❌";
        String msg   = approved
                ? "Great news! Your academic credential has been <strong>verified and approved</strong>. You can now share it with employers."
                : "Unfortunately, your verification request has been <strong>rejected</strong>. Please contact the academic office for more information.";

        String htmlBody = """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto;">
                  <div style="background: linear-gradient(135deg, #059669 0%%, #10b981 100%%);\
                 padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">AcademiVerify</h1>
                    <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Credential Verification Update</p>
                  </div>
                  <div style="background: #ffffff; padding: 40px 32px; border-radius: 0 0 12px 12px;\
                 border: 1px solid #e8e8e8; border-top: none;">
                    <div style="text-align: center; margin-bottom: 24px;">
                      <span style="font-size: 56px;">%s</span>
                    </div>
                    <h2 style="color: %s; text-align: center; margin: 0 0 16px;">%s</h2>
                    <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">%s</p>
                    <div style="background: #f7fafc; border-left: 4px solid %s; border-radius: 4px;\
                 padding: 16px; margin-bottom: 24px;">
                      <p style="margin: 0; color: #4a5568; font-size: 13px;">Credential Serial Number:</p>
                      <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700; color: #2d3748; letter-spacing: 2px;">%s</p>
                    </div>
                    <p style="color: #718096; font-size: 13px; margin: 0;">This is an automated notification from AcademiVerify.</p>
                  </div>
                </div>
                """.formatted(icon, color, status, msg, color, credentialSerial);

        helper.setText(htmlBody, true);
        mailSender.send(message);
    }
}
