
package com.capiq.dto;

public class ResumeRequest {

    private String name;
    private String headline;
    private String email;
    private String phone;
    private String location;
    private String linkedin;
    private String github;
    private String summary;
    private String education;
    private String college;
    private String graduation;
    private String experience;
    private String projects;
    private String skills;
    private String achievements;

    public ResumeRequest() {
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getGraduation() { return graduation; }
    public void setGraduation(String graduation) { this.graduation = graduation; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getProjects() { return projects; }
    public void setProjects(String projects) { this.projects = projects; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getAchievements() { return achievements; }
    public void setAchievements(String achievements) { this.achievements = achievements; }
}
