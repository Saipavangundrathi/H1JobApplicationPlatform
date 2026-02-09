package com.h1b.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.h1b.backend.dto.AiKeywordSuggestionResponse;
import com.h1b.backend.dto.AiResumeAnalysisResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class AiResumeService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiResumeService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    // Feature 1: Tailored Resume (Kept unchanged)
    public String generateTailoredResume(String originalResume, String jobDescription) {
        String prompt = """
            You are an expert resume writer for H1B international students.
            Rewrite the following resume to better match the job description.
            Highlight skills relevant to the job.
            
            JOB DESCRIPTION:
            %s
            
            ORIGINAL RESUME:
            %s
            """.formatted(jobDescription, originalResume);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    // Feature 2: Analyze Resume (THE FIXED METHOD)
    public AiResumeAnalysisResponse analyzeResume(String resumeText) {
        String prompt = """
            You are a tech recruiter. Analyze this resume for a Java Backend role.
            Give a score out of 100, list 3 strengths, and 3 missing keywords.
            
            IMPORTANT: Return ONLY raw JSON. Do not use Markdown formatting (no ```json).
            Format: {"score": number, "strengths": ["str1", "str2"], "improvements": ["imp1", "imp2"]}
            
            RESUME:
            %s
            """.formatted(resumeText);

        // 1. Get response from AI
        String content = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        // 2. DEBUG: Print it to console so you can see if it worked
        System.out.println("DEBUG AI RAW RESPONSE: " + content);

        try {
            // 3. CLEAN IT: Remove markdown code blocks if they exist
            String cleanJson = content.replace("```json", "")
                                      .replace("```", "")
                                      .trim();

            // 4. Parse it
            return objectMapper.readValue(cleanJson, AiResumeAnalysisResponse.class);
        } catch (Exception ex) {
            System.err.println("❌ JSON Parse Error. AI returned: " + content);
            throw new RuntimeException("Failed to parse AI response", ex);
        }
    }

    public AiKeywordSuggestionResponse suggestKeywords(String resumeText, String jobDescription) {
        String prompt = """
            You are an ATS expert. Compare the resume with the job description and suggest keywords to add.
            Return a score (0-100) for ATS match and a list of 5-10 missing keywords.

            IMPORTANT: Return ONLY raw JSON. Do not use Markdown formatting (no ```json).
            Format: {"score": number, "keywords": ["keyword1", "keyword2"]}

            JOB DESCRIPTION:
            %s

            RESUME:
            %s
            """.formatted(jobDescription, resumeText);

        String content = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        System.out.println("DEBUG AI KEYWORDS RAW RESPONSE: " + content);

        try {
            String cleanJson = content.replace("```json", "")
                                      .replace("```", "")
                                      .trim();

            return objectMapper.readValue(cleanJson, AiKeywordSuggestionResponse.class);
        } catch (Exception ex) {
            System.err.println("❌ JSON Parse Error. AI returned: " + content);
            throw new RuntimeException("Failed to parse AI keyword response", ex);
        }
    }
}
