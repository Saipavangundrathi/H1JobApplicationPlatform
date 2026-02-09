package com.h1b.backend.service;

import com.h1b.backend.dto.external.JSearchJobDto;
import com.h1b.backend.dto.external.JSearchResponse;
import com.h1b.backend.entity.Job;
import com.h1b.backend.repository.JobRepository;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class JobFetchService {

    private static final Logger logger = LoggerFactory.getLogger(JobFetchService.class);
    private static final String API_URL = "https://jsearch.p.rapidapi.com/search";

    private final JobRepository jobRepository;
    private final EmbeddingService embeddingService;
    private final JdbcTemplate jdbcTemplate;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${rapidapi.key}")
    private String rapidApiKey;

    @Value("${rapidapi.host:jsearch.p.rapidapi.com}")
    private String rapidApiHost;

    // Fetch new jobs every 4 hours to keep data fresh
    @Scheduled(cron = "0 0 */4 * * *")
    @EventListener(ApplicationReadyEvent.class)
    @SuppressWarnings("null")
    public void fetchDailyJobs() {
        System.out.println("DEBUG: Starting BULK fetch for all IT sectors...");
        String[] queries = {
                "Software Engineer H1B sponsorship",
                "Data Scientist H1B sponsorship",
                "DevOps Engineer H1B sponsorship",
                "Full Stack Developer H1B sponsorship",
                "Cybersecurity Analyst H1B sponsorship",
                "Java Developer H1B sponsorship"
        };

        for (String query : queries) {
            fetchJobsForQuery(query);
            try {
                Thread.sleep(2000);
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
                return;
            }
        }

        System.out.println("DEBUG: Bulk fetch complete.");
    }

    @SuppressWarnings("null")
    private void fetchJobsForQuery(String query) {
        System.out.println("DEBUG: Fetching category: " + query);
        // date_posted=3days ensures only fresh jobs, sort_by=date prioritizes latest
        String url = API_URL + "?query={query}&num_pages=1&date_posted=3days&sort_by=date";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-RapidAPI-Key", rapidApiKey);
        headers.set("X-RapidAPI-Host", rapidApiHost);

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        try {
            ResponseEntity<JSearchResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    requestEntity,
                    JSearchResponse.class,
                    query);

            JSearchResponse body = response.getBody();
            List<JSearchJobDto> jobs = body != null && body.getData() != null
                    ? body.getData()
                    : List.of();

            int savedCount = 0;
            for (JSearchJobDto dto : jobs) {
                if (dto.getJobId() == null || jobRepository.existsByExternalId(dto.getJobId())) {
                    continue;
                }
                if (shouldSkip(dto.getJobDescription())) {
                    continue;
                }

                Job job = Job.builder()
                        .title(dto.getJobTitle())
                        .company(dto.getEmployerName())
                        .location(formatLocation(dto))
                        .description(dto.getJobDescription())
                        .postedAt(parsePostedAt(dto.getJobPostedAtDatetimeUtc()))
                        .isVerified(false)
                        .sponsorshipStatus("H1B Sponsor")
                        .externalId(dto.getJobId())
                        .jobProvider(dto.getJobPublisher())
                        .sourceUrl(dto.getJobApplyLink())
                        .build();

                logger.info("Saving Job: {} - Link: {}", job.getTitle(), job.getSourceUrl());
                Job savedJob = jobRepository.save(job);

                // Vectorize: combine title + description and generate embedding
                vectorizeJob(savedJob);
                savedCount++;
            }

            System.out.println("DEBUG: Saved " + savedCount + " new jobs for " + query);
        } catch (Exception ex) {
            System.out.println("DEBUG: Failed to fetch for " + query + ": " + ex.getMessage());
        }
    }

    private String formatLocation(JSearchJobDto dto) {
        String city = dto.getJobCity();
        String state = dto.getJobState();
        String country = dto.getJobCountry();
        StringBuilder builder = new StringBuilder();
        if (city != null && !city.isBlank()) {
            builder.append(city);
        }
        if (state != null && !state.isBlank()) {
            if (builder.length() > 0) {
                builder.append(", ");
            }
            builder.append(state);
        }
        if (country != null && !country.isBlank()) {
            if (builder.length() > 0) {
                builder.append(", ");
            }
            builder.append(country);
        }
        return builder.length() > 0 ? builder.toString() : null;
    }

    private LocalDateTime parsePostedAt(String postedAtUtc) {
        if (postedAtUtc == null || postedAtUtc.isBlank()) {
            return null;
        }
        try {
            return OffsetDateTime.parse(postedAtUtc).toLocalDateTime();
        } catch (Exception ex) {
            return null;
        }
    }

    /**
     * Combines title + description, generates an embedding vector,
     * and stores it on the job's row via JDBC (pgvector column).
     */
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

    private boolean shouldSkip(String description) {
        if (description == null) {
            return false;
        }
        String normalized = description.toLowerCase();
        return normalized.contains("us citizen only") || normalized.contains("green card only");
    }
}
