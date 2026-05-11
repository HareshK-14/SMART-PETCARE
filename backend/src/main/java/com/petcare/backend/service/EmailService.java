package com.petcare.backend.service;

import com.petcare.backend.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(User user, String token) throws MessagingException {
        // Points to the React frontend route which will extract the token and call the backend API
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        String displayName = user.getEmail().split("@")[0];

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(user.getEmail());
        helper.setSubject("\u2705 SmartPetCare \u2014 Verify your Email Address");

        String html = "<!DOCTYPE html><html><body>"
                + "<div style='font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;"
                + "background:#f0f9ff;border-radius:16px;'>"
                + "<div style='text-align:center;margin-bottom:24px;'>"
                + "<span style='font-size:40px;'>&#128062;</span>"
                + "<h2 style='color:#1e293b;margin:8px 0 4px;'>Welcome to SmartPetCare!</h2>"
                + "<p style='color:#64748b;margin:0;'>Hi <strong>" + displayName + "</strong>, "
                + "click the button below to verify your email and activate your account.</p>"
                + "</div>"
                + "<div style='text-align:center;margin:32px 0;'>"
                + "<a href='" + verificationUrl + "' "
                + "style='display:inline-block;background:linear-gradient(135deg,#6366f1,#14b8a6);"
                + "color:#fff;font-weight:700;font-size:16px;padding:14px 36px;"
                + "border-radius:12px;text-decoration:none;'>"
                + "&#9989; Verify Email Address</a>"
                + "</div>"
                + "<p style='color:#94a3b8;font-size:12px;text-align:center;'>"
                + "Or copy and paste this URL into your browser on your computer:<br>"
                + "<span style='color:#6366f1;word-break:break-all;'>" + verificationUrl + "</span></p>"
                + "<p style='color:#94a3b8;font-size:13px;text-align:center;margin-top:16px;'>"
                + "This link expires in 24 hours.<br>If you did not register, please ignore this email.</p>"
                + "<p style='color:#cbd5e1;font-size:11px;text-align:center;margin-top:24px;'>"
                + "&#169; 2026 SmartPetCare Platform</p>"
                + "</div></body></html>";

        helper.setText(html, true);
        mailSender.send(message);

        System.out.println("✅ Verification email sent to: " + user.getEmail());
        System.out.println("🔗 Direct verify URL: " + verificationUrl);
    }
}
