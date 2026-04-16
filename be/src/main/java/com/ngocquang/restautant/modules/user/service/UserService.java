package com.ngocquang.restautant.modules.user.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ngocquang.restautant.common.ApiResponse;
import com.ngocquang.restautant.common.CurrentUserUtil;
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
    private final CurrentUserUtil currentUserUtil;

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
        User currentUser = currentUserUtil.getCurrentUser();
        User userToUpdate = this.userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Case 1: User cập nhật thông tin cá nhân của chính mình
        if (currentUser.getId().equals(id)) {
            // Người dùng chỉ được update fullname, phone, email
            if (request.getFullname() != null && !request.getFullname().trim().isEmpty()) {
                userToUpdate.setFullname(request.getFullname());
            }
            if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
                userToUpdate.setEmail(request.getEmail());
            }
            if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
                userToUpdate.setPhone(request.getPhone());
            }
        }
        // Case 2: Admin thay đổi trạng thái của tài khoản
        else if (currentUser.getRole().equals("ADMIN")) {
            // Admin chỉ được update isActive
            if (request.getIsActive() != null) {
                userToUpdate.setIs_active(request.getIsActive());
            }
        }
        // Case 3: Không phải user chính mình và không phải admin
        else {
            throw new BadRequestException("You can only update your own information");
        }

        return toResponse(this.userRepository.save(userToUpdate));
    }
}
