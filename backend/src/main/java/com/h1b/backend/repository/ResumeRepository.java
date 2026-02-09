package com.h1b.backend.repository;

import com.h1b.backend.entity.Resume;
import com.h1b.backend.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUser(User user);
    Optional<Resume> findByIdAndUser(Long id, User user);
    long countByUser(User user);

    @Modifying
    @Query("UPDATE Resume r SET r.isMaster = false WHERE r.user.id = :userId")
    int resetMasterForUser(@Param("userId") Long userId);
}
