package com.h1b.backend.dto;

import com.h1b.backend.entity.Role;

public record UserProfileResponse(
        String firstName,
        String lastName,
        String email,
        Role role
) {
}
