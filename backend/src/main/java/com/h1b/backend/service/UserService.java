package com.h1b.backend.service;

import com.h1b.backend.dto.UpdatePasswordRequest;
import com.h1b.backend.dto.UpdateProfileRequest;
import com.h1b.backend.entity.User;
import com.h1b.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User updateProfile(String email, UpdateProfileRequest request) {
        User user = getByEmail(email);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        return userRepository.save(user);
    }

    public void updatePassword(String email, UpdatePasswordRequest request) {
        User user = getByEmail(email);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void deleteUser(String email) {
        User user = getByEmail(email);
        userRepository.delete(user);
    }

    private User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
