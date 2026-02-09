package com.h1b.backend.controller;

import com.h1b.backend.entity.Job;
import com.h1b.backend.service.UserActivityService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserActivityController {

    private final UserActivityService userActivityService;

    @GetMapping("/applications")
    public List<Job> getApplications(Authentication authentication) {
        return userActivityService.getAppliedJobs(authentication.getName());
    }

    @GetMapping("/saved-jobs")
    public List<Job> getSavedJobs(Authentication authentication) {
        return userActivityService.getSavedJobs(authentication.getName());
    }

    @PostMapping("/jobs/{id}/apply")
    public void applyToJob(Authentication authentication, @PathVariable("id") Long jobId) {
        userActivityService.applyToJob(authentication.getName(), jobId);
    }

    @PostMapping("/jobs/{id}/save")
    public void saveJob(Authentication authentication, @PathVariable("id") Long jobId) {
        userActivityService.saveJob(authentication.getName(), jobId);
    }

    @DeleteMapping("/jobs/{id}/save")
    public void removeSavedJob(Authentication authentication, @PathVariable("id") Long jobId) {
        userActivityService.removeSavedJob(authentication.getName(), jobId);
    }
}
