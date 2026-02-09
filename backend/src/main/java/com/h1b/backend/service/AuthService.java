package com.h1b.backend.service;

import com.h1b.backend.dto.AuthenticationResponse;
import com.h1b.backend.dto.LoginRequest;
import com.h1b.backend.dto.RegisterRequest;
import com.h1b.backend.entity.Role;
import com.h1b.backend.entity.User;
import com.h1b.backend.repository.UserRepository;
import com.h1b.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        // 1. Check if user exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        // 2. Create User Entity using Builder
        var user = User.builder()
                .firstName(request.getFirstName()) // Matches the DTO getter
                .lastName(request.getLastName())   // Matches the DTO getter
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .city(request.getCity())
                .targetRoles(request.getTargetRoles())
                .yearsExperience(request.getYearsExperience())
                .visaStatus(request.getVisaStatus())
                .role(Role.USER) // Default role
                .build();

        // 3. Save to DB
        userRepository.save(user);

        // 4. Generate Token (Pass the User entity directly!)
        String token = jwtService.generateToken(user);
        System.out.println("DEBUG LOGIN: User " + user.getFirstName() + " is logging in. Sending response.");
        return AuthenticationResponse.builder()
                .token(token)
                .firstname(user.getFirstName())
                .lastname(user.getLastName())
                .email(user.getEmail())
                .build();
    }

    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .firstname(user.getFirstName())
                .lastname(user.getLastName())
                .email(user.getEmail())
                .build();
    }
}