package com.h1b.backend.controller;

import com.h1b.backend.entity.Job;
import com.h1b.backend.entity.User;
import com.h1b.backend.repository.UserRepository;
import com.h1b.backend.service.JobService;
import com.h1b.backend.service.RecommendationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        return jobService.createJob(job);
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    /**
     * RAG endpoint: returns top 10 jobs matching the authenticated user's
     * resume embedding via cosine similarity.
     */
    @GetMapping("/recommendations")
    public List<Job> getRecommendations(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return recommendationService.findSmartMatchesForUser(user.getId());
    }
}
