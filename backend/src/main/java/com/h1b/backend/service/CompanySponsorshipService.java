package com.h1b.backend.service;

import com.h1b.backend.entity.CompanySponsorship;
import com.h1b.backend.repository.CompanySponsorshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CompanySponsorshipService {

    private final CompanySponsorshipRepository repository;

    public CompanySponsorship getStats(String companyName) {
        if (companyName == null || companyName.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Company name is required");
        }
        String trimmed = companyName.trim();
        return repository.findByCompanyNameIgnoreCase(trimmed)
                .or(() -> repository.findByCompanyNameIgnoreCase(normalize(trimmed)))
                .or(() -> repository.findFirstByCompanyNameContainingIgnoreCase(trimmed))
                .or(() -> repository.findFirstByCompanyNameContainingIgnoreCase(normalize(trimmed)))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
    }

    private String normalize(String name) {
        return name.replaceAll("\\s+(Inc\\.?|LLC|L\\.L\\.C\\.|Corp\\.?|Corporation|Ltd\\.?|Limited)$", "")
                .trim();
    }
}
