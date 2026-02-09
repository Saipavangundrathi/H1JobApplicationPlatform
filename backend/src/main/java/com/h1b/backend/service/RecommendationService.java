package com.h1b.backend.service;

import com.h1b.backend.entity.Job;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);

    private final JdbcTemplate jdbcTemplate;

    /**
     * Uses pgvector cosine similarity to find the top 10 jobs
     * that best match a user's resume embedding.
     *
     * The <=> operator computes cosine distance (0 = identical, 2 = opposite).
     * We subtract from 1 to get a similarity score (1 = perfect match).
     */
    public List<Job> findSmartMatchesForUser(Long userId) {
        logger.info("Finding recommended jobs for user id={}", userId);

        String sql = """
                SELECT j.id, j.title, j.company, j.location, j.posted_at,
                       1 - (j.embedding <=> u.embedding) as similarity
                FROM jobs j, app_users u
                WHERE u.id = ?
                  AND j.embedding IS NOT NULL
                  AND u.embedding IS NOT NULL
                ORDER BY similarity DESC
                LIMIT 10
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Job job = new Job();
            job.setId(rs.getLong("id"));
            job.setTitle(rs.getString("title"));
            job.setCompany(rs.getString("company"));
            job.setLocation(rs.getString("location"));

            java.sql.Timestamp ts = rs.getTimestamp("posted_at");
            if (ts != null) {
                job.setPostedAt(ts.toLocalDateTime());
            }

            double similarity = rs.getDouble("similarity");
            if (rowNum == 0) {
                System.out.println("Top similarity score: " + similarity);
            }
            logger.debug("Job '{}' similarity: {}", job.getTitle(), similarity);

            return job;
        }, userId);
    }
}
