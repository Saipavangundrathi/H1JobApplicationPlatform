package com.h1b.backend.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class EmbeddingService {

    private static final Logger logger = LoggerFactory.getLogger(EmbeddingService.class);

    private final EmbeddingModel embeddingModel;

    /**
     * Converts any text into a 1536-dimension vector using OpenAI's
     * text-embedding-3-small model.
     */
    public List<Double> generateEmbedding(String text) {
        if (text == null || text.isBlank()) {
            logger.warn("Empty text passed to generateEmbedding, returning empty list");
            return List.of();
        }

        // Clean the text: collapse whitespace, trim
        String cleaned = text.replaceAll("[\\r\\n]+", " ")
                             .replaceAll("\\s{2,}", " ")
                             .trim();

        // Truncate to ~8000 chars to stay within token limits
        if (cleaned.length() > 8000) {
            cleaned = cleaned.substring(0, 8000);
        }

        float[] floatEmbedding = embeddingModel.embed(cleaned);

        // Convert float[] to List<Double> for JDBC/pgvector compatibility
        List<Double> embedding = new java.util.ArrayList<>(floatEmbedding.length);
        for (float f : floatEmbedding) {
            embedding.add((double) f);
        }

        logger.info("Generated embedding with {} dimensions", embedding.size());
        return embedding;
    }
}
