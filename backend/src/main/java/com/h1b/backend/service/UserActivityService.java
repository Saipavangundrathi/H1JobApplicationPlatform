package com.h1b.backend.service;

import com.h1b.backend.entity.Job;
import com.h1b.backend.entity.JobApplication;
import com.h1b.backend.entity.SavedJob;
import com.h1b.backend.entity.User;
import com.h1b.backend.repository.JobApplicationRepository;
import com.h1b.backend.repository.JobRepository;
import com.h1b.backend.repository.SavedJobRepository;
import com.h1b.backend.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserActivityService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final SavedJobRepository savedJobRepository;

    public List<Job> getAppliedJobs(String email) {
        User user = getUser(email);
        return jobApplicationRepository.findByUser(user)
                .stream()
                .map(JobApplication::getJob)
                .toList();
    }

    public List<Job> getSavedJobs(String email) {
        User user = getUser(email);
        return savedJobRepository.findByUser(user)
                .stream()
                .map(SavedJob::getJob)
                .toList();
    }

    public void applyToJob(String email, Long jobId) {
        User user = getUser(email);
        Job job = getJob(jobId);
        JobApplication application = JobApplication.builder()
                .user(user)
                .job(job)
                .status("APPLIED")
                .build();
        jobApplicationRepository.save(application);
    }

    public void saveJob(String email, Long jobId) {
        User user = getUser(email);
        Job job = getJob(jobId);
        boolean exists = savedJobRepository.findByUserAndJobId(user, jobId).isPresent();
        if (!exists) {
            SavedJob savedJob = SavedJob.builder()
                    .user(user)
                    .job(job)
                    .build();
            savedJobRepository.save(savedJob);
        }
    }

    public void removeSavedJob(String email, Long jobId) {
        User user = getUser(email);
        savedJobRepository.deleteByUserAndJobId(user, jobId);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Job getJob(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
    }
}
