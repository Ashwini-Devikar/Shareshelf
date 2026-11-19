package com.shareshelf.config;

import com.shareshelf.entity.Role;
import com.shareshelf.entity.User;
import com.shareshelf.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Creates a default admin account the first time the app starts. */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(UserRepository users,
                                  PasswordEncoder encoder,
                                  @Value("${app.admin.email}") String email,
                                  @Value("${app.admin.password}") String password) {
        return args -> {
            if (!users.existsByEmail(email)) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail(email);
                admin.setPassword(encoder.encode(password));
                admin.setRole(Role.ADMIN);
                admin.setCity("Nagpur");
                users.save(admin);
                System.out.println(">>> Default admin created: " + email);
            }
        };
    }
}
