
package com.capiq.dto;

public class AuthResponse {

    private String message;
    private Long id;
    private String name;
    private String email;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(
            String message,
            Long id,
            String name,
            String email,
            String token) {
        this.message = message;
        this.id = id;
        this.name = name;
        this.email = email;
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getToken() {
        return token;
    }
}
