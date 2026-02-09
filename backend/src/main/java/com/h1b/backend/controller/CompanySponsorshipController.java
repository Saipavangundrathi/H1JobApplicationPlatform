package com.h1b.backend.controller;

import com.h1b.backend.entity.CompanySponsorship;
import com.h1b.backend.service.CompanySponsorshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanySponsorshipController {

    private final CompanySponsorshipService companySponsorshipService;

    @GetMapping("/stats")
    public CompanySponsorship getStats(@RequestParam("name") String name) {
        return companySponsorshipService.getStats(name);
    }
}
