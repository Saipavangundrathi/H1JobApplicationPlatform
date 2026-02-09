package com.h1b.backend.dto;

import java.util.List;

public record AiResumeAnalysisResponse(int score, List<String> strengths, List<String> improvements) {
}
