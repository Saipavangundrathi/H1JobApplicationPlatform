package com.h1b.backend;

import com.h1b.backend.entity.Job;
import com.h1b.backend.repository.CompanySponsorshipRepository;
import com.h1b.backend.repository.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class H1BBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(H1BBackendApplication.class, args);
	}
}
