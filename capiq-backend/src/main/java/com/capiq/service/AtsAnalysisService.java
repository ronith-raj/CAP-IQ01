package com.capiq.service;

import com.capiq.dto.AtsAnalysisRequest;
import com.capiq.dto.AtsAnalysisResponse;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AtsAnalysisService {

    private static final List<String> COMMON_SKILLS = List.of(
            "java", "python", "c++", "javascript", "typescript",
            "react", "spring boot", "sql", "mysql", "mongodb",
            "html", "css", "rest api", "git", "github",
            "data structures", "algorithms", "machine learning",
            "data analysis", "power bi", "excel", "aws",
            "docker", "communication", "leadership",
            "problem solving", "teamwork"
    );

    public AtsAnalysisResponse analyze(AtsAnalysisRequest request) {
        JsonNode resume = request.resume();

        if (resume == null || resume.isNull() || !resume.isObject()) {
            throw new IllegalArgumentException(
                    "Please provide valid resume data."
            );
        }

        String resumeText = flatten(resume).toLowerCase(Locale.ROOT);
        String jobDescription = request.jobDescription() == null
                ? ""
                : request.jobDescription().toLowerCase(Locale.ROOT).trim();

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        if (!jobDescription.isBlank()) {
            Set<String> jobKeywords = COMMON_SKILLS.stream()
                    .filter(skill -> containsTerm(jobDescription, skill))
                    .collect(Collectors.toCollection(LinkedHashSet::new));

            for (String keyword : jobKeywords) {
                if (containsTerm(resumeText, keyword)) {
                    matched.add(keyword);
                } else {
                    missing.add(keyword);
                }
            }
        }

        int completeness = completenessScore(resume);
        int keywordScore = jobDescription.isBlank()
                ? generalKeywordScore(resumeText)
                : (matched.size() + missing.size() == 0
                ? 0
                : (int) Math.round(
                100.0 * matched.size()
                        / (matched.size() + missing.size())
        ));

        int readability = readabilityScore(resumeText);
        int impact = impactScore(resumeText);

        Map<String, Integer> categories = new LinkedHashMap<>();
        categories.put("Completeness", completeness);
        categories.put("Keyword match", keywordScore);
        categories.put("Readability", readability);
        categories.put("Project impact", impact);

        int score = (int) Math.round(
                completeness * 0.30
                        + keywordScore * 0.35
                        + readability * 0.20
                        + impact * 0.15
        );

        List<String> suggestions = new ArrayList<>();

        if (completeness < 100) {
            suggestions.add(
                    "Complete your contact, education, skills and project details."
            );
        }

        if (!jobDescription.isBlank() && !missing.isEmpty()) {
            suggestions.add(
                    "Consider adding relevant missing keywords when they "
                            + "truthfully reflect your skills: "
                            + String.join(", ", missing.subList(
                            0, Math.min(5, missing.size())
                    )) + "."
            );
        }

        if (readability < 70) {
            suggestions.add(
                    "Use clear section headings and concise bullet points."
            );
        }

        if (impact < 70) {
            suggestions.add(
                    "Explain what you built, the tools you used and the "
                            + "result of each project."
            );
        }

        if (suggestions.isEmpty()) {
            suggestions.add(
                    "Your resume passes these basic checks. Review it against "
                            + "the specific internship requirements before applying."
            );
        }

        String summary = score >= 80
                ? "Strong result on these basic checks; review the remaining suggestions."
                : score >= 60
                ? "Good starting point. Improve the areas listed below."
                : "Several areas could be improved before you apply.";

        return new AtsAnalysisResponse(
                score,
                categories,
                matched,
                missing,
                suggestions,
                summary
        );
    }

    private int completenessScore(JsonNode resume) {
        String[] possibleFields = {
                "name", "email", "phone", "headline",
                "education", "degree", "skills", "projects"
        };

        int present = 0;

        for (String field : possibleFields) {
            JsonNode value = resume.get(field);

            if (value != null && !value.isNull()
                    && !value.asText("").isBlank()
                    && !value.isEmpty()) {
                present++;
            }
        }

        return (int) Math.round(
                100.0 * present / possibleFields.length
        );
    }

    private int generalKeywordScore(String text) {
        long count = COMMON_SKILLS.stream()
                .filter(skill -> containsTerm(text, skill))
                .count();

        return (int) Math.min(100, count * 15);
    }

    private int readabilityScore(String text) {
        if (text.isBlank()) return 0;

        int score = 50;

        if (text.length() >= 200) score += 15;
        if (text.length() >= 500) score += 10;
        if (text.contains("education")) score += 10;
        if (text.contains("skills")) score += 10;
        if (text.contains("projects") || text.contains("experience")) {
            score += 5;
        }

        return Math.min(score, 100);
    }

    private int impactScore(String text) {
        if (text.isBlank()) return 0;

        int score = 40;

        if (Pattern.compile("\\b(built|developed|designed|implemented)\\b")
                .matcher(text).find()) {
            score += 20;
        }

        if (Pattern.compile("\\b(measured|improved|reduced|increased|achieved)\\b")
                .matcher(text).find()) {
            score += 20;
        }

        if (Pattern.compile("\\b\\d+%?\\b").matcher(text).find()) {
            score += 20;
        }

        return Math.min(score, 100);
    }

    private boolean containsTerm(String text, String term) {
        String regex = "(?<![a-z0-9])"
                + Pattern.quote(term.toLowerCase(Locale.ROOT))
                + "(?![a-z0-9])";

        return Pattern.compile(regex).matcher(text).find();
    }

    private String flatten(JsonNode node) {
        if (node == null || node.isNull()) return "";

        if (node.isValueNode()) {
            return node.asText();
        }

        StringBuilder result = new StringBuilder();
        node.elements().forEachRemaining(child -> {
            result.append(' ').append(flatten(child));
        });

        return result.toString();
    }
}