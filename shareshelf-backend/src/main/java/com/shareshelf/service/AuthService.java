package com.shareshelf.service;

import com.shareshelf.dto.AuthResponse;
import com.shareshelf.dto.LoginRequest;
import com.shareshelf.dto.RegisterRequest;
import com.shareshelf.entity.Role;
import com.shareshelf.entity.User;
import com.shareshelf.exception.ApiException;
import com.shareshelf.repository.UserRepository;
import com.shareshelf.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtUtil jwtUtil) {
        this.users = users;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();

        if (users.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        User user = new User();
        user.setName(req.name().trim());
        user.setEmail(email);
        user.setPassword(encoder.encode(req.password()));
        user.setCity(req.city());
        user.setRole(Role.USER);
        users.save(user);

        return toResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        String email = req.email().trim().toLowerCase();

        User user = users.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!encoder.matches(req.password(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return toResponse(user);
    }

    private AuthResponse toResponse(User u) {
        String token = jwtUtil.generateToken(u.getEmail(), u.getRole().name());
        return new AuthResponse(token, u.getId(), u.getName(), u.getEmail(), u.getRole().name(), u.getCity());
    }
}
