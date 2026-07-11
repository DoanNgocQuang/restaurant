package com.ngocquang.restautant.common;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import com.ngocquang.restautant.modules.auth.service.JwtService;
import com.ngocquang.restautant.modules.user.entity.User;
import com.ngocquang.restautant.modules.user.repository.UserRepository;
import com.ngocquang.restautant.common.helper.ResourceNotFoundException;
import com.ngocquang.restautant.common.helper.BadRequestException;

@Component
@RequiredArgsConstructor
public class CurrentUserUtil {

    private final HttpServletRequest request;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public User getCurrentUser() {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            throw new BadRequestException("Missing token");
        }

        String token = header.substring(7);

        String username = jwtService.extractUsername(token);

        return userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}