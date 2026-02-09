package com.h1b.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 512)
    private String title;

    @Column(length = 512)
    private String company;

    @Column(length = 512)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String sponsorshipStatus;

    @Default
    private Boolean isVerified = false;

    @Column(length = 512)
    private String externalId;

    @Column(length = 512)
    private String jobProvider;

    @Column(columnDefinition = "TEXT")
    private String sourceUrl;

    private LocalDateTime postedAt;

    @Column(columnDefinition = "vector(1536)", insertable = false, updatable = false)
    private String embedding; // read-only for JPA; writes go through JdbcTemplate

    @PrePersist
    private void onCreate() {
        if (postedAt == null) {
            postedAt = LocalDateTime.now();
        }
    }
}
