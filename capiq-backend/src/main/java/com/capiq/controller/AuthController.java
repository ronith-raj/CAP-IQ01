package com.capiq.controller;

import com.capiq.dto.AuthResponse;
import com.capiq.dto.LoginRequest;
import com.capiq.entity.User;
import com.capiq.service.AuthService;
import com.capiq.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {
        try {
            User user = authService.authenticate(request);

            String token = jwtService.generateToken(user.getEmail());

            AuthResponse response = new AuthResponse(
                    "Login successful",
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    token
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }
    }
}