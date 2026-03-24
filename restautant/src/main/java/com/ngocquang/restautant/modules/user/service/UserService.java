package com.ngocquang.restautant.modules.user.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ngocquang.restautant.common.helper.BadRequestException;
import com.ngocquang.restautant.common.helper.ResourceNotFoundException;
import com.ngocquang.restautant.modules.user.dto.UserRequest;
import com.ngocquang.restautant.modules.user.dto.UserResponse;
import com.ngocquang.restautant.modules.user.entity.User;
import com.ngocquang.restautant.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullname(user.getFullname())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .isActive(user.getIs_active())
                .createdAt(user.getCreated_at())
                .build();
    }

    public List<UserResponse> fetchUsers() {
        return this.userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(int id) {
        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toResponse(user);
    }

    public UserResponse createUser(UserRequest request) {
        if (this.userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists: " + request.getEmail());
        }

        User user = new User();
        user.setFullname(request.getFullname());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(this.passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.Customer);
        user.setIs_active(request.getIsActive() != null ? request.getIsActive() : Boolean.TRUE);

        return toResponse(this.userRepository.save(user));
    }

    public void updateUser(Integer id, UserRequest request) {
        User userInDB = this.userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (!userInDB.getEmail().equalsIgnoreCase(request.getEmail())
                && this.userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists: " + request.getEmail());
        }

        userInDB.setFullname(request.getFullname());
        userInDB.setPhone(request.getPhone());
        userInDB.setIs_active(request.getIsActive() != null ? request.getIsActive() : userInDB.getIs_active());
        userInDB.setEmail(request.getEmail());
        this.userRepository.save(userInDB);
    }

    public void deleteUserById(Integer id) {
        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        this.userRepository.delete(user);
    }
}