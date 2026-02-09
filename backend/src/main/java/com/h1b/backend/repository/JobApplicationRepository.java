package com.h1b.backend.repository;

import com.h1b.backend.entity.JobApplication;
import com.h1b.backend.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByUser(User user);
}
