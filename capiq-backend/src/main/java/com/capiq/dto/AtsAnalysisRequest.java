package com.capiq.dto;

import com.fasterxml.jackson.databind.JsonNode;

public record AtsAnalysisRequest(
        JsonNode resume,
        String jobDescription
) {}