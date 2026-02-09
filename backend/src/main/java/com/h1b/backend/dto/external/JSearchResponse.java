package com.h1b.backend.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JSearchResponse {
    private String status;
    private String request_id;
    private List<JSearchJobDto> data;
}
