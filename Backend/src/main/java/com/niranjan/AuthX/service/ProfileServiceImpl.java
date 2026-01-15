package com.niranjan.AuthX.service;

import com.niranjan.AuthX.entity.UserEntity;
import com.niranjan.AuthX.io.ProfileRequest;
import com.niranjan.AuthX.io.ProfileResponse;
import com.niranjan.AuthX.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public ProfileResponse createProfile(ProfileRequest request) {
        UserEntity newProfile = convertToEntity(request);
        if (!userRepository.existsByEmail(request.getEmail())){
            newProfile = userRepository.save(newProfile);
            return convertToResponse(newProfile);
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
    }

    @Override
    public ProfileResponse getProfile(String email) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + email));
        return convertToResponse(existingUser);
    }

    @Override
    public void sendResetOtp(String email) {
        UserEntity existingEntity = userRepository.findByEmail(email)
                .orElseThrow( () ->
                        new UsernameNotFoundException("User not found: " + email));
        //generate 6 digit otp:
         String Otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        //expire time (current time + 24 hr in millis)
        long expiryTime = System.currentTimeMillis() + (15 * 60 * 1000);

        //update the profile/user
        existingEntity.setResetOtp(Otp);
        existingEntity.setResetOtpExpireAt(expiryTime);

        //save into db
        userRepository.save(existingEntity);

        try{
            emailService.sendResetOtpEmail(existingEntity.getEmail(), Otp);
        }catch(Exception ex){
            throw new RuntimeException("Unable to send email");
        }
    }

    @Override
    public void resetPassword(String email, String newPassword, String otp) {
        UserEntity existingEntity = userRepository.findByEmail(email)
                .orElseThrow( () ->
                        new UsernameNotFoundException("User not found: " + email));

        if (existingEntity.getResetOtp() == null || !existingEntity.getResetOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if(existingEntity.getResetOtpExpireAt() < System.currentTimeMillis()){
            throw new RuntimeException("OTP has expired");
        }

        existingEntity.setPassword(passwordEncoder.encode(newPassword));
        existingEntity.setResetOtp(null);
        existingEntity.setResetOtpExpireAt(0L);

        userRepository.save(existingEntity);
    }

    @Override
    public void sendOtp(String email) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow( () ->
                        new UsernameNotFoundException("User not found: " + email));
        if (existingUser.getIsAccountVerified() != null && existingUser.getIsAccountVerified()) {
            throw new RuntimeException("Account is already verified");
        }

        //generate 6 digit otp:
        String Otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        //calculate expire time (current time + 24 hr in millis)
        long expiryTime = System.currentTimeMillis() + (24 * 60 * 60 * 1000);

        //update the profile/user
        existingUser.setVerifyOtp(Otp);
        existingUser.setVerifyOtpExpireAt(expiryTime);

        //save into db
        userRepository.save(existingUser);

        try{
            emailService.sendOtpEmail(existingUser.getEmail(), Otp);
        }catch(Exception ex){
            throw new RuntimeException("Unable to send email");
        }
    }

    @Override
    public void verifyOtp(String email, String otp) {

        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow( () ->
                        new UsernameNotFoundException("User not found: " + email));

        if (existingUser.getVerifyOtp() == null || !existingUser.getVerifyOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if(existingUser.getVerifyOtpExpireAt() < System.currentTimeMillis()){
            throw new RuntimeException("OTP has expired");
        }

        existingUser.setIsAccountVerified(true);
        existingUser.setVerifyOtp(null);
        existingUser.setVerifyOtpExpireAt(0L);

        userRepository.save(existingUser);
    }

    private ProfileResponse convertToResponse(UserEntity newProfile) {
        return ProfileResponse.builder()
                .name(newProfile.getName())
                .email(newProfile.getEmail())
                .userId(newProfile.getUserId())
                .isAccountVerified(newProfile.getIsAccountVerified())
                .build();
    }

    private UserEntity convertToEntity(ProfileRequest request){
        return UserEntity.builder()
                .email(request.getEmail())
                .userId(java.util.UUID.randomUUID().toString())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .isAccountVerified(false)
                .resetOtpExpireAt(0L)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .resetOtp(null)
                .build();
    }
}
