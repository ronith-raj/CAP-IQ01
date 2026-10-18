
package com.capiq.service;

import com.capiq.dto.LoginRequest;
import com.capiq.entity.User;
import com.capiq.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User authenticate(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"));

        if (user.getPasswordHash() == null ||
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPasswordHash())) {
            throw new IllegalArgumentException(
                    "Invalid email or password");
        }

        return user;
    }
}
