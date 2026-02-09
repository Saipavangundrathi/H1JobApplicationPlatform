package com.h1b.backend.service;

import com.h1b.backend.dto.ResumeAnalysisResponse;
import com.h1b.backend.dto.ResumeSummaryResponse;
import com.h1b.backend.entity.Resume;
import com.h1b.backend.entity.User;
import com.h1b.backend.repository.ResumeRepository;
import com.h1b.backend.repository.UserRepository;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class ResumeService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeService.class);

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ResumeParsingService resumeParsingService;
    private final EmbeddingService embeddingService;
    private final JdbcTemplate jdbcTemplate;

    public ResumeAnalysisResponse analyzeResume(MultipartFile file) {
        // TODO: Connect to Python/Llama3 Microservice here
        return new ResumeAnalysisResponse(
                78,
                List.of(
                        "Missing keywords: Java, Spring",
                        "Format is good",
                        "Quantify your impact more"));
    }

    @Transactional
    public ResumeSummaryResponse uploadResume(String email, MultipartFile file) {
        User user = getUser(email);
        boolean isFirst = resumeRepository.countByUser(user) == 0;

        String safeFileName = file.getOriginalFilename();
        if (safeFileName == null || safeFileName.isBlank()) {
            safeFileName = "Resume_" + System.currentTimeMillis() + ".pdf";
        }

        byte[] fileBytes = readBytes(file);

        Resume resume = Resume.builder()
                .user(user)
                .fileName(safeFileName)
                .fileType(file.getContentType())
                .data(fileBytes)
                .isMaster(isFirst)
                .build();
        Resume saved = resumeRepository.save(resume);

        // If this is the first resume (auto-master), vectorize the user
        if (isFirst) {
            vectorizeUser(user, fileBytes);
        }

        return new ResumeSummaryResponse(
                saved.getId(),
                saved.getFileName(),
                saved.getUploadedAt(),
                saved.isMaster());
    }

    public List<ResumeSummaryResponse> listResumes(String email) {
        User user = getUser(email);
        return resumeRepository.findByUser(user)
                .stream()
                .map(resume ->
                        new ResumeSummaryResponse(
                                resume.getId(),
                                resume.getFileName(),
                                resume.getUploadedAt(),
                                resume.isMaster()))
                .toList();
    }

    public Resume downloadResume(String email, Long resumeId) {
        User user = getUser(email);
        return resumeRepository.findByIdAndUser(resumeId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume not found"));
    }

    @Transactional
    public ResumeSummaryResponse setMaster(String email, Long resumeId) {
        User user = getUser(email);

        // 1. Get ALL resumes for this user
        List<Resume> allResumes = resumeRepository.findByUser(user);

        Resume targetResume = null;

        // 2. Loop through them to "Swap" the flags
        for (Resume resume : allResumes) {
            if (resume.getId().equals(resumeId)) {
                resume.setMaster(true); // Turn ON the one we clicked
                targetResume = resume;
            } else {
                resume.setMaster(false); // Turn OFF everyone else
            }
            // 3. Save the state
            resumeRepository.save(resume);
        }

        if (targetResume == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume not found");
        }

        // Re-vectorize the user with the new master resume
        vectorizeUser(user, targetResume.getData());

        return new ResumeSummaryResponse(
                targetResume.getId(),
                targetResume.getFileName(),
                targetResume.getUploadedAt(),
                true);
    }

    public void deleteResume(String email, Long resumeId) {
        User user = getUser(email);
        Resume resume = resumeRepository.findByIdAndUser(resumeId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume not found"));
        resumeRepository.delete(resume);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    /**
     * Extracts text from a PDF resume, generates an embedding vector,
     * and stores it on the user's row via JDBC (pgvector column).
     */
    private void vectorizeUser(User user, byte[] pdfData) {
        try {
            String resumeText = resumeParsingService.extractText(pdfData);
            if (resumeText.isBlank()) {
                logger.warn("No text extracted from resume for user {}", user.getEmail());
                return;
            }

            List<Double> embedding = embeddingService.generateEmbedding(resumeText);
            if (embedding.isEmpty()) {
                return;
            }

            // Store via JDBC because JPA doesn't natively handle pgvector
            String vectorString = embedding.toString(); // [0.1, 0.2, ...]
            jdbcTemplate.update(
                    "UPDATE app_users SET embedding = ?::vector WHERE id = ?",
                    vectorString, user.getId());

            logger.info("Vectorized user {} (id={}) with {} dimensions",
                    user.getEmail(), user.getId(), embedding.size());
        } catch (Exception ex) {
            logger.error("Failed to vectorize user {}: {}", user.getEmail(), ex.getMessage());
        }
    }

    private byte[] readBytes(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to read resume file");
        }
    }
}
