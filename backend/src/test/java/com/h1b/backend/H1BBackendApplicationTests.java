package com.h1b.backend;

import org.junit.jupiter.api.Test;

class H1BBackendApplicationTests {

	@Test
	void contextLoads() {
		// Removed @SpringBootTest to avoid requiring a live PostgreSQL
		// database during Maven builds. Integration tests should be run
		// separately with the database available.
	}

}
