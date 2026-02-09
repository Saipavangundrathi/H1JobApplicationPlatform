package com.h1b.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumeSummaryResponse {

    private Long id;

    @JsonProperty("fileName")
    private String fileName;

    private LocalDateTime uploadedAt;

    @JsonProperty("isMaster")
    private boolean isMaster;
}
