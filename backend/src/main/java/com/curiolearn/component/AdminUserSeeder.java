package com.curiolearn.component;

import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AdminUserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        Optional<User> admin = userRepository.findByEmail("admin@physiombbs.com");
        if (admin.isEmpty()) {
            User newAdmin = User.builder()
                    .email("admin@physiombbs.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .firstName("System")
                    .lastName("Admin")
                    .role("ADMIN")
                    .build();
            userRepository.save(newAdmin);
            System.out.println("Seeded default admin user: admin@physiombbs.com");
        }
    }
}

