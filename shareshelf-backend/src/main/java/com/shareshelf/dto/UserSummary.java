package com.shareshelf.dto;

import com.shareshelf.entity.User;
import java.time.LocalDateTime;

public record UserSummary(Long id, String name, String email, String role, String city, LocalDateTime createdAt) {

    public static UserSummary from(User u) {
        return new UserSummary(u.getId(), u.getName(), u.getEmail(), u.getRole().name(), u.getCity(), u.getCreatedAt());
    }
}
