package com.ngocquang.restautant.common.seeder;

import com.ngocquang.restautant.modules.user.entity.User;
import com.ngocquang.restautant.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@gmail.com"; // Choose a suitable admin email
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .fullname("Super Administrator")
                    .email(adminEmail)
                    .phone("0123456789")
                    .password(passwordEncoder.encode("123456"))
                    .role(User.Role.ADMIN)
                    .is_active(Boolean.TRUE)
                    .created_at(LocalDateTime.now())
                    .build();

            userRepository.save(admin);
            log.info("Default Admin account created successfully! Email: {}, Password: {}", adminEmail, "admin123456");
        } else {
            log.info("Admin account already exists.");
        }
    }
}
