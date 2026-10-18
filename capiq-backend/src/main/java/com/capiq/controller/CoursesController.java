package com.capiq.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CoursesController {
    @GetMapping
    public List<Map<String, Object>> getCourses() {
        return List.of(
            course(1, "React Fundamentals", "Development", "Beginner", "6 hours", 18, "⚛", "violet", "Build modern interfaces with components, props, hooks and state.", List.of("React", "JavaScript", "UI Development"), 65, true),
            course(2, "Java Programming", "Development", "Beginner", "8 hours", 24, "☕", "blue", "Master object-oriented programming and solve real coding problems.", List.of("Java", "OOP", "Problem Solving"), 30, false),
            course(3, "UI/UX Essentials", "Design", "Beginner", "4 hours", 12, "✳", "pink", "Create intuitive experiences through wireframes and visual design.", List.of("Figma", "Wireframes", "UX"), 0, true),
            course(4, "Career Launchpad", "Career", "Intermediate", "5 hours", 15, "↗", "green", "Prepare for internships with portfolios, interviews and career skills.", List.of("Interviews", "Portfolio", "Communication"), 0, false),
            course(5, "Python for Data Science", "Data Science", "Intermediate", "10 hours", 30, "⌘", "orange", "Explore Python, data analysis and your first practical datasets.", List.of("Python", "Pandas", "Analytics"), 15, false),
            course(6, "Digital Marketing", "Business", "Beginner", "3 hours", 10, "◈", "cyan", "Learn content strategy, audience research and campaign basics.", List.of("SEO", "Content", "Strategy"), 0, false)
        );
    }

    private Map<String, Object> course(int id, String title, String category, String level,
            String duration, int lessons, String icon, String color, String description,
            List<String> skills, int progress, boolean featured) {
        return Map.ofEntries(
            Map.entry("id", id),
            Map.entry("title", title),
            Map.entry("category", category),
            Map.entry("level", level),
            Map.entry("duration", duration),
            Map.entry("lessons", lessons),
            Map.entry("icon", icon),
            Map.entry("color", color),
            Map.entry("description", description),
            Map.entry("skills", skills),
            Map.entry("progress", progress),
            Map.entry("featured", featured)
        );
    }
}
