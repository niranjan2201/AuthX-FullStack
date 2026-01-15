package com.niranjan.AuthX.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void sendWelcomeEmail(String toEmail, String name) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to AuthX");

            helper.setText(buildWelcomeEmail(name), true); // ✅ HTML enabled

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }

    private String buildWelcomeEmail(String name) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #f5f7fa;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                 Roboto, Helvetica, Arial, sans-serif;
                }
                .wrapper {
                    padding: 24px;
                }
                .card {
                    max-width: 560px;
                    margin: auto;
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 32px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
                }
                .title {
                    font-size: 22px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 20px;
                }
                .text {
                    font-size: 14px;
                    color: #374151;
                    line-height: 1.6;
                    margin-bottom: 16px;
                }
                .divider {
                    height: 1px;
                    background-color: #e5e7eb;
                    margin: 24px 0;
                }
                .footer {
                    font-size: 12px;
                    color: #6b7280;
                }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="card">
                    <div class="title">Welcome to AuthX</div>

                    <div class="text">
                        Hello, %s
                    </div>

                    <div class="text">
                        Welcome to AuthX! Thanks for registering with us. 
                        We're excited to have you on board.
                    </div>
                    <div class="divider"></div>
                    <div class="footer">
                        Best regards,<br/>
                        The AuthX Team
                    </div>
                </div>
            </div>
        </body>
        </html>
        """.formatted(name);
    }

    //OTP reset email
    public void sendResetOtpEmail(String toEmail, String otp) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("AuthX Password Reset OTP");

            helper.setText(buildResetOtpEmail(otp), true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send reset OTP email", e);
        }
    }

    private String buildResetOtpEmail(String otp) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #f5f7fa;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                 Roboto, Helvetica, Arial, sans-serif;
                }
                .wrapper {
                    padding: 24px;
                }
                .card {
                    max-width: 560px;
                    margin: auto;
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 32px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
                }
                .logo {
                    text-align: center;
                    margin-bottom: 24px;
                }
                .title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 16px;
                }
                .text {
                    font-size: 14px;
                    color: #374151;
                    line-height: 1.6;
                    margin-bottom: 16px;
                }
                .otp-box {
                    text-align: center;
                    font-size: 24px;
                    font-weight: 700;
                    letter-spacing: 4px;
                    color: #111827;
                    background-color: #f3f4f6;
                    padding: 16px;
                    border-radius: 8px;
                    margin: 24px 0;
                }
                .divider {
                    height: 1px;
                    background-color: #e5e7eb;
                    margin: 24px 0;
                }
                .footer {
                    font-size: 12px;
                    color: #6b7280;
                }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="card">

                    <div style="
                                text-align: center;
                                font-size: 24px;
                                font-weight: 700;
                                color: #111827;
                                margin-bottom: 24px;
                            ">
                                Welcome to AuthX
                    </div>
                    
                    <div class="title">Password Reset Request</div>

                    <div class="text">
                        Use the following OTP to reset your password.
                    </div>

                    <div class="otp-box">
                        %s
                    </div>

                    <div class="text">
                        This OTP is valid for 15 minutes.
                        If you did not request a password reset, you can safely ignore this email.
                    </div>

                    <div class="divider"></div>

                    <div class="footer">
                        Thanks,<br/>
                        The AuthX Team
                    </div>
                </div>
            </div>
        </body>
        </html>
        """.formatted(otp);
    }

    public void sendOtpEmail(String toEmail, String otp) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Account Verification OTP");

            helper.setText(buildAccountVerificationOtpEmail(otp), true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification OTP email", e);
        }
    }

    private String buildAccountVerificationOtpEmail(String otp) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #f5f7fa;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                 Roboto, Helvetica, Arial, sans-serif;
                }
                .wrapper {
                    padding: 24px;
                }
                .card {
                    max-width: 560px;
                    margin: auto;
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 32px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
                }
                .header {
                    text-align: center;
                    font-size: 24px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 24px;
                }
                .text {
                    font-size: 14px;
                    color: #374151;
                    line-height: 1.6;
                    margin-bottom: 16px;
                }
                .otp-box {
                    text-align: center;
                    font-size: 26px;
                    font-weight: 700;
                    letter-spacing: 4px;
                    color: #111827;
                    background-color: #f3f4f6;
                    padding: 16px;
                    border-radius: 8px;
                    margin: 24px 0;
                }
                .divider {
                    height: 1px;
                    background-color: #e5e7eb;
                    margin: 24px 0;
                }
                .footer {
                    font-size: 12px;
                    color: #6b7280;
                }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="card">

                    <div class="header">
                        Welcome to AuthX
                    </div>

                    <div class="text">
                        Use the following OTP to verify your email address.
                    </div>

                    <div class="otp-box">
                        %s
                    </div>

                    <div class="text">
                        If you did not create this account, you can safely ignore this email.
                    </div>

                    <div class="divider"></div>

                    <div class="footer">
                        Thanks,<br/>
                        The AuthX Team
                    </div>
                </div>
            </div>
        </body>
        </html>
        """.formatted(otp);
    }


}
