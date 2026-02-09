package com.h1b.backend.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JSearchJobDto {
    @JsonProperty("job_id")
    private String jobId;

    @JsonProperty("job_title")
    private String jobTitle;

    @JsonProperty("employer_name")
    private String employerName;

    @JsonProperty("job_city")
    private String jobCity;

    @JsonProperty("job_state")
    private String jobState;

    @JsonProperty("job_country")
    private String jobCountry;

    @JsonProperty("job_description")
    private String jobDescription;

    @JsonProperty("job_apply_link")
    private String jobApplyLink;

    @JsonProperty("job_posted_at_datetime_utc")
    private String jobPostedAtDatetimeUtc;

    @JsonProperty("job_publisher")
    private String jobPublisher;
}
