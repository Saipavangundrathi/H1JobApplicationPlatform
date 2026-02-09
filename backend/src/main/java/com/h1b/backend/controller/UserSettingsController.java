package com.h1b.backend.controller;

import com.h1b.backend.dto.UpdatePasswordRequest;
import com.h1b.backend.dto.UpdateProfileRequest;
import com.h1b.backend.dto.UserProfileResponse;
import com.h1b.backend.entity.User;
import com.h1b.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserSettingsController {

    private final UserService userService;

    @PutMapping("/profile")
    public UserProfileResponse updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {
        String email = authentication.getName();
        User updated = userService.updateProfile(email, request);
        return new UserProfileResponse(
                updated.getFirstName(),
                updated.getLastName(),
                updated.getEmail(),
                updated.getRole());
    }

    @PutMapping("/password")
    public void updatePassword(
            Authentication authentication,
            @RequestBody UpdatePasswordRequest request) {
        String email = authentication.getName();
        userService.updatePassword(email, request);
    }

    @DeleteMapping
    public void deleteUser(Authentication authentication) {
        String email = authentication.getName();
        userService.deleteUser(email);
    }
}
