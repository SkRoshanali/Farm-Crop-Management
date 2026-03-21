package com.farmcrop.config;

import com.farmcrop.entity.User;
import com.farmcrop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Initializes demo user accounts on application startup.
 * Creates default admin and user accounts for testing purposes.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Skip if users already exist
        if (userRepository.existsByUsername("admin") && userRepository.existsByUsername("user")) {
            return;
        }

        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@farmcrop.local")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.STATE_OFFICER)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            System.out.println("✓ Admin user created (username: admin, password: admin123)");
        }

        // Create demo user if not exists
        if (!userRepository.existsByUsername("user")) {
            User demoUser = User.builder()
                    .username("user")
                    .email("user@farmcrop.local")
                    .password(passwordEncoder.encode("user123"))
                    .role(User.Role.DATA_ENTRY_OPERATOR)
                    .enabled(true)
                    .build();
            userRepository.save(demoUser);
            System.out.println("✓ Demo user created (username: user, password: user123)");
        }
    }
}
