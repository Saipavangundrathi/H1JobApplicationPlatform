package com.h1b.backend.controller;

import com.h1b.backend.entity.Job;
import com.h1b.backend.entity.Resume;
import com.h1b.backend.entity.User;
import com.h1b.backend.repository.JobRepository;
import com.h1b.backend.repository.ResumeRepository;
import com.h1b.backend.repository.UserRepository;
import com.h1b.backend.service.EmbeddingService;
import com.h1b.backend.service.ResumeParsingService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final EmbeddingService embeddingService;
    private final ResumeParsingService resumeParsingService;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Temporary backfill endpoint to generate missing embeddings
     * for existing jobs and the current user.
     */
    @PostMapping("/backfill-vectors")
    public Map<String, Object> backfillVectors(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        int jobsBackfilled = 0;
        List<Job> jobs = jobRepository.findAll();
        for (Job job : jobs) {
            if (job.getEmbedding() != null) {
                continue;
            }
            String text = (job.getTitle() != null ? job.getTitle() : "") + " "
                        + (job.getDescription() != null ? job.getDescription() : "");
            List<Double> embedding = embeddingService.generateEmbedding(text.trim());
            if (embedding.isEmpty()) {
                continue;
            }
            jdbcTemplate.update(
                    "UPDATE jobs SET embedding = ?::vector WHERE id = ?",
                    embedding.toString(), job.getId());
            jobsBackfilled++;
        }

        boolean userBackfilled = false;
        Optional<Resume> masterResume = resumeRepository.findByUser(user)
                .stream()
                .filter(Resume::isMaster)
                .findFirst();

        if (masterResume.isPresent()) {
            String resumeText = resumeParsingService.extractText(masterResume.get().getData());
            List<Double> embedding = embeddingService.generateEmbedding(resumeText);
            if (!embedding.isEmpty()) {
                jdbcTemplate.update(
                        "UPDATE app_users SET embedding = ?::vector WHERE id = ?",
                        embedding.toString(), user.getId());
                userBackfilled = true;
            }
        } else {
            logger.warn("No master resume found for user {}", user.getEmail());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("jobsBackfilled", jobsBackfilled);
        response.put("userBackfilled", userBackfilled);
        response.put("userId", user.getId());
        return response;
    }
}
