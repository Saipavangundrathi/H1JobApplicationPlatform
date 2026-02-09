package com.h1b.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
  
    @JsonProperty("firstname") 
    private String firstName;
    
    @JsonProperty("lastname")  
    private String lastName;
    
    private String email;
    private String password;

    private String city;
    private String targetRoles;
    private Integer yearsExperience;
    private String visaStatus;
}