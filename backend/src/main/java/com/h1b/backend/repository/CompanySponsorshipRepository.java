package com.h1b.backend.repository;

import com.h1b.backend.entity.CompanySponsorship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CompanySponsorshipRepository extends JpaRepository<CompanySponsorship, Long> {
    Optional<CompanySponsorship> findByCompanyNameIgnoreCase(String name);
    Optional<CompanySponsorship> findFirstByCompanyNameContainingIgnoreCase(String name);
}
