package com.h1b.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "app_users")
public class User implements UserDetails { // 👈 KEY CHANGE: Implements UserDetails

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    private String password;

    private String city;
    private String targetRoles;
    private Integer yearsExperience;
    private String visaStatus;

    @Enumerated(EnumType.STRING)
    private Role role; // Optional: We can default this to USER

    @Column(columnDefinition = "vector(1536)", insertable = false, updatable = false)
    private String embedding; // read-only for JPA; writes go through JdbcTemplate

    // 👇 SPRING SECURITY METHODS 👇

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Simple default: All users get "USER" role
        return List.of(new SimpleGrantedAuthority(role != null ? role.name() : "USER"));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email; // We use Email as the Username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}