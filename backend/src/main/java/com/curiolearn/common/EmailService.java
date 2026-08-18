package com.curiolearn.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetLink) {
        String subject = "Password Reset Request";
        String content = "To reset your password, please click the link below:\n\n" + resetLink + "\n\nIf you did not request this, please ignore this email.";
        
        // For development when mail is mocked or fails
        logger.info("\n--- EMAIL SIMULATION ---\nTo: {}\nSubject: {}\nContent: \n{}\n-------------------------", to, subject, content);

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(content);
                message.setFrom("noreply@physiology.app");
                mailSender.send(message);
                logger.info("Password reset email sent to {}", to);
            } catch (Exception e) {
                logger.error("Failed to send email to {}", to, e);
            }
        }
    }
}


