package com.h1b.backend.service;

import com.h1b.backend.entity.Job;
import com.h1b.backend.repository.JobRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class JobService {

    private static final Logger logger = LoggerFactory.getLogger(JobService.class);

    private final JobRepository jobRepository;
    private final EmbeddingService embeddingService;
    private final JdbcTemplate jdbcTemplate;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job createJob(Job job) {
        Job savedJob = jobRepository.save(job);

        // Vectorize: combine title + description and generate embedding
        vectorizeJob(savedJob);
        return savedJob;
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    private void vectorizeJob(Job job) {
        try {
            String text = (job.getTitle() != null ? job.getTitle() : "") + " "
                    + (job.getDescription() != null ? job.getDescription() : "");
            List<Double> embedding = embeddingService.generateEmbedding(text.trim());
            if (embedding.isEmpty()) {
                return;
            }

            String vectorString = embedding.toString(); // [0.1, 0.2, ...]
            jdbcTemplate.update(
                    "UPDATE jobs SET embedding = ?::vector WHERE id = ?",
                    vectorString, job.getId());

            logger.info("Vectorized job {} (id={})", job.getTitle(), job.getId());
        } catch (Exception ex) {
            logger.error("Failed to vectorize job {}: {}", job.getId(), ex.getMessage());
        }
    }
}