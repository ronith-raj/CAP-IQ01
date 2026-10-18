package com.capiq.dto;

import java.util.List;
import java.util.Map;

public record AtsAnalysisResponse(
        int score,
        Map<String, Integer> categoryScores,
        List<String> matchedKeywords,
        List<String> missingKeywords,
        List<String> suggestions,
        String summary
) {}