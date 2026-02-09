package com.h1b.backend.controller;

import com.h1b.backend.dto.ResumeAnalysisResponse;
import com.h1b.backend.dto.ResumeSummaryResponse;
import com.h1b.backend.entity.Resume;
import com.h1b.backend.service.AiResumeService;
import com.h1b.backend.service.ResumeService;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/resumes") // <--- FIX 1: Changed to PLURAL "resumes"
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@SuppressWarnings("null")
public class ResumeController {

    private final AiResumeService aiResumeService;
    private final ResumeService resumeService;

    @PostMapping("/tailor")
    // FIX 2: Changed return type to Map (JSON) instead of String
    public Map<String, String> tailorResume(@RequestBody Map<String, String> request) {

        // FIX 3: Changed key to "resumeText" to match Frontend
        String resume = request.get("resumeText");
        String jobDesc = request.get("jobDescription");

        String result = aiResumeService.generateTailoredResume(resume, jobDesc);

        // Wrap the result in JSON so the Frontend can read it
        return Map.of("tailoredResume", result);
    }

    @PostMapping("/analyze")
    public ResumeAnalysisResponse analyzeResume(@RequestParam("file") MultipartFile file) {
        return resumeService.analyzeResume(file);
    }

    @PostMapping("/upload")
    public ResumeSummaryResponse uploadResume(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        return resumeService.uploadResume(authentication.getName(), file);
    }

    @GetMapping
    public List<ResumeSummaryResponse> listResumes(Authentication authentication) {
        return resumeService.listResumes(authentication.getName());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadResume(
            Authentication authentication,
            @PathVariable("id") Long resumeId) {
        Resume resume = resumeService.downloadResume(authentication.getName(), resumeId);
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resume.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(
                        resume.getFileType() != null ? resume.getFileType() : MediaType.APPLICATION_OCTET_STREAM_VALUE))
                .body(resume.getData());
    }

    @PutMapping("/{id}/master")
    public ResumeSummaryResponse setMaster(
            Authentication authentication,
            @PathVariable("id") Long resumeId) {
        return resumeService.setMaster(authentication.getName(), resumeId);
    }

    @PostMapping("/{id}/master")
    public ResumeSummaryResponse setMasterPost(
            Authentication authentication,
            @PathVariable("id") Long resumeId) {
        return resumeService.setMaster(authentication.getName(), resumeId);
    }

    @DeleteMapping("/{id}")
    public void deleteResume(
            Authentication authentication,
            @PathVariable("id") Long resumeId) {
        resumeService.deleteResume(authentication.getName(), resumeId);
    }
}