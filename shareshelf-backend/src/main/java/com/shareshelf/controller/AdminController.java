package com.shareshelf.controller;

import com.shareshelf.dto.UserSummary;
import com.shareshelf.entity.Role;
import com.shareshelf.entity.User;
import com.shareshelf.exception.ApiException;
import com.shareshelf.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository users;

    public AdminController(UserRepository users) {
        this.users = users;
    }

    @GetMapping("/users")
    public List<UserSummary> listUsers() {
        return users.findAll().stream().map(UserSummary::from).toList();
    }

    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id, Authentication auth) {
        User target = users.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (target.getEmail().equals(auth.getName())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot delete your own account");
        }
        if (target.getRole() == Role.ADMIN) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Admin accounts cannot be deleted here");
        }
        users.delete(target);
    }
}
