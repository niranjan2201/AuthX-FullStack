package com.niranjan.AuthX.service;

import com.niranjan.AuthX.io.ProfileRequest;
import com.niranjan.AuthX.io.ProfileResponse;

public interface ProfileService {

   ProfileResponse createProfile(ProfileRequest request);
   ProfileResponse getProfile(String email);
   void sendResetOtp(String email);
   void resetPassword(String email, String newPassword, String otp);


   void sendOtp(String email);
   void verifyOtp(String email, String otp);
}
