package com.h1b.backend.repository;

import com.h1b.backend.entity.SavedJob;
import com.h1b.backend.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUser(User user);
    Optional<SavedJob> findByUserAndJobId(User user, Long jobId);
    void deleteByUserAndJobId(User user, Long jobId);
}
