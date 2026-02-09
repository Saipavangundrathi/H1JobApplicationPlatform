package com.h1b.backend.dto;

import java.util.List;

public record AiKeywordSuggestionResponse(int score, List<String> keywords) {
}
