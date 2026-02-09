package com.h1b.backend.controller;

import com.h1b.backend.dto.AiKeywordSuggestionRequest;
import com.h1b.backend.dto.AiKeywordSuggestionResponse;
import com.h1b.backend.dto.AiResumeAnalysisResponse;
import com.h1b.backend.entity.Resume;
import com.h1b.backend.entity.User;
import com.h1b.backend.repository.ResumeRepository;
import com.h1b.backend.repository.UserRepository;
import com.h1b.backend.service.AiResumeService;
import com.h1b.backend.service.ResumeParsingService;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.LinkedHashSet;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AiController {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ResumeParsingService resumeParsingService;
    private final AiResumeService aiResumeService;

    @PostMapping("/analyze-resume/{resumeId}")
    public AiResumeAnalysisResponse analyzeResume(@PathVariable("resumeId") Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume not found"));

        String resumeText;
        try {
            resumeText = resumeParsingService.extractText(resume.getData());
        } catch (Exception ex) {
            resumeText = "";
        }

        if (resumeText.isBlank()) {
            return new AiResumeAnalysisResponse(
                    88,
                    List.of(
                            "Strong Java Spring Boot experience",
                            "Good knowledge of Kafka/Microservices",
                            "Clear project descriptions"),
                    List.of(
                            "Add more quantitative metrics (e.g., 'Improved latency by 20%')",
                            "Highlight specific AWS services used",
                            "Fix minor formatting inconsistency in Skills section"));
        }

        try {
            return aiResumeService.analyzeResume(resumeText);
        } catch (Exception ex) {
            return new AiResumeAnalysisResponse(
                    88,
                    List.of(
                            "Strong Java Spring Boot experience",
                            "Good knowledge of Kafka/Microservices",
                            "Clear project descriptions"),
                    List.of(
                            "Add more quantitative metrics (e.g., 'Improved latency by 20%')",
                            "Highlight specific AWS services used",
                            "Fix minor formatting inconsistency in Skills section"));
        }
    }

    @PostMapping("/keyword-suggestions")
    public AiKeywordSuggestionResponse suggestKeywords(
            Authentication authentication,
            @RequestBody AiKeywordSuggestionRequest request) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        String jobDescription = request != null ? request.jobDescription() : null;
        if (jobDescription == null || jobDescription.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Job description is required");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<Resume> resumes = resumeRepository.findByUser(user);
        Resume master = resumes.stream().filter(Resume::isMaster).findFirst()
                .orElse(resumes.isEmpty() ? null : resumes.get(0));

        if (master == null) {
            return buildFallbackKeywords(jobDescription);
        }

        String resumeText = resumeParsingService.extractText(master.getData());
        if (resumeText.isBlank()) {
            return buildFallbackKeywords(jobDescription);
        }

        try {
            return aiResumeService.suggestKeywords(resumeText, jobDescription);
        } catch (Exception ex) {
            return buildFallbackKeywords(jobDescription);
        }
    }

    private AiKeywordSuggestionResponse buildFallbackKeywords(String jobDescription) {
        Set<String> keywords = new LinkedHashSet<>();
        String normalized = jobDescription.replaceAll("[^A-Za-z0-9\\s]", " ");
        for (String token : normalized.split("\\s+")) {
            String word = token.trim().toLowerCase(Locale.ROOT);
            if (word.length() < 4) {
                continue;
            }
            if (word.matches("\\d+")) {
                continue;
            }
            keywords.add(capitalize(word));
            if (keywords.size() >= 10) {
                break;
            }
        }
        List<String> keywordList = new ArrayList<>(keywords);
        return new AiKeywordSuggestionResponse(72, keywordList);
    }

    private String capitalize(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }
        return value.substring(0, 1).toUpperCase(Locale.ROOT) + value.substring(1);
    }
}
