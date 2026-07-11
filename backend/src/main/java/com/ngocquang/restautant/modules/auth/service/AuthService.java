package com.ngocquang.restautant.modules.auth.service;

import com.ngocquang.restautant.common.helper.BadRequestException;
import com.ngocquang.restautant.modules.auth.dto.AuthResponse;
import com.ngocquang.restautant.modules.auth.dto.LoginRequest;
import com.ngocquang.restautant.modules.auth.dto.RegisterRequest;
import com.ngocquang.restautant.modules.user.entity.User;
import com.ngocquang.restautant.modules.user.repository.UserRepository;
import com.ngocquang.restautant.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists: " + request.getEmail());
        }

        User user = User.builder()
                .fullname(request.getFullname())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.CUSTOMER)
                .is_active(Boolean.TRUE)
                .created_at(LocalDateTime.now())
                .build();

        user = this.userRepository.save(user);

        String jwtToken = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(jwtToken)
                .user(userService.toResponse(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        if (!user.getIs_active()) {
            throw new BadRequestException("User account is disabled");
        }

        String jwtToken = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(jwtToken)
                .user(userService.toResponse(user))
                .build();
    }
}
