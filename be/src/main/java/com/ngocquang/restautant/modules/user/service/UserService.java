package com.ngocquang.restautant.modules.user.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

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

    public UserResponse updateUser(Integer id, UserRequest request) {
        User userInDB = this.userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        userInDB.setIs_active(request.getIsActive() != null ? request.getIsActive() : userInDB.getIs_active());

        return toResponse(this.userRepository.save(userInDB));
    }
}
