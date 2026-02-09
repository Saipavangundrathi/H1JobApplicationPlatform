package com.h1b.backend.config;

import com.h1b.backend.entity.CompanySponsorship;
import com.h1b.backend.repository.CompanySponsorshipRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final CompanySponsorshipRepository companySponsorshipRepository;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) {
        if (companySponsorshipRepository.count() > 0) {
            return;
        }
        List<CompanySponsorship> seed = List.of(
                CompanySponsorship.builder()
                        .companyName("Amazon")
                        .h1bFiled(8500)
                        .approvalRate(0.98)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("Infosys")
                        .h1bFiled(4000)
                        .approvalRate(0.99)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("Tata Consultancy Services")
                        .h1bFiled(3200)
                        .approvalRate(0.97)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("Google")
                        .h1bFiled(6000)
                        .approvalRate(0.985)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("Microsoft")
                        .h1bFiled(4500)
                        .approvalRate(0.99)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("Meta")
                        .h1bFiled(2200)
                        .approvalRate(0.98)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("Deloitte")
                        .h1bFiled(12500)
                        .approvalRate(0.99)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("Apple")
                        .h1bFiled(1800)
                        .approvalRate(0.99)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("Ernst & Young")
                        .h1bFiled(6500)
                        .approvalRate(0.99)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("Capgemini")
                        .h1bFiled(2800)
                        .approvalRate(0.96)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("Accenture")
                        .h1bFiled(3500)
                        .approvalRate(0.98)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("IBM")
                        .h1bFiled(2100)
                        .approvalRate(0.97)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("JPMorgan Chase")
                        .h1bFiled(1500)
                        .approvalRate(0.99)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("Intel")
                        .h1bFiled(1200)
                        .approvalRate(0.98)
                        .build(),
                CompanySponsorship.builder()
                        .companyName("Cisco")
                        .h1bFiled(1100)
                        .approvalRate(0.98)
                        .build()
        );
        companySponsorshipRepository.saveAll(seed);
    }
}
