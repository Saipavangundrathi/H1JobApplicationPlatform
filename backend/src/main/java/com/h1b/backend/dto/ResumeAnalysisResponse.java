package com.h1b.backend.dto;

import java.util.List;

public record ResumeAnalysisResponse(int score, List<String> feedback) {
}
