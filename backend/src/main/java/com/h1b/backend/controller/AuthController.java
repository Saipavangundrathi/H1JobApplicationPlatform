package com.h1b.backend.controller;

import com.h1b.backend.dto.AuthenticationResponse;
import com.h1b.backend.dto.LoginRequest;
import com.h1b.backend.dto.RegisterRequest;
import com.h1b.backend.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthenticationResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
