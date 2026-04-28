package com.ngocquang.restautant.modules.comment.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ngocquang.restautant.common.helper.BadRequestException;
import com.ngocquang.restautant.common.helper.ResourceNotFoundException;
import com.ngocquang.restautant.modules.comment.dto.CommentRequest;
import com.ngocquang.restautant.modules.comment.dto.CommentResponse;
import com.ngocquang.restautant.modules.comment.entity.Comment;
import com.ngocquang.restautant.modules.comment.repository.CommentRepository;
import com.ngocquang.restautant.modules.combo.entity.Combo;
import com.ngocquang.restautant.modules.combo.repository.ComboRepository;
import com.ngocquang.restautant.modules.food.entity.Food;
import com.ngocquang.restautant.modules.food.repository.FoodRepository;
import com.ngocquang.restautant.modules.systemlog.entity.SystemAction;
import com.ngocquang.restautant.modules.systemlog.service.SystemLogService;
import com.ngocquang.restautant.modules.user.entity.User;
import com.ngocquang.restautant.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final FoodRepository foodRepository;
    private final ComboRepository comboRepository;
    private final UserRepository userRepository;
    private final SystemLogService systemLogService;

    // CREATE

    @Transactional
    public CommentResponse createCommentForFood(
            Integer foodId,
            Integer userId,
            CommentRequest request) {

        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new ResourceNotFoundException("Food not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .rating(request.getRating())
                .food(food)
                .user(user)
                .status(Comment.Status.ACTIVE)
                .created_at(LocalDateTime.now())
                .updated_at(LocalDateTime.now())
                .build();

        comment = commentRepository.save(comment);

        systemLogService.log(
                SystemAction.CREATE,
                "Tạo comment #" + comment.getId()
                        + " | Food: " + food.getName()
                        + " | Rating: " + comment.getRating(),
                user);

        return CommentResponse.fromEntity(comment);
    }

    @Transactional
    public CommentResponse createCommentForCombo(
            Integer comboId,
            Integer userId,
            CommentRequest request) {

        Combo combo = comboRepository.findById(comboId)
                .orElseThrow(() -> new ResourceNotFoundException("Combo not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .rating(request.getRating())
                .combo(combo)
                .user(user)
                .status(Comment.Status.ACTIVE)
                .created_at(LocalDateTime.now())
                .updated_at(LocalDateTime.now())
                .build();

        comment = commentRepository.save(comment);

        systemLogService.log(
                SystemAction.CREATE,
                "Tạo comment #" + comment.getId()
                        + " | Combo: " + combo.getName()
                        + " | Rating: " + comment.getRating(),
                user);

        return CommentResponse.fromEntity(comment);
    }

    // UPDATE

    @Transactional
    public CommentResponse updateComment(
            Integer commentId,
            Integer userId,
            CommentRequest request) {

        Comment comment = findComment(commentId);

        if (!comment.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only edit your own comment");
        }

        comment.setContent(request.getContent());
        comment.setRating(request.getRating());
        comment.setUpdated_at(LocalDateTime.now());

        comment = commentRepository.save(comment);

        systemLogService.log(
                SystemAction.UPDATE,
                "Update comment #" + comment.getId()
                        + " | Rating: " + comment.getRating(),
                comment.getUser());

        return CommentResponse.fromEntity(comment);
    }

    @Transactional
    public CommentResponse updateCommentStatus(
            Integer commentId,
            Comment.Status status) {

        Comment comment = findComment(commentId);

        comment.setStatus(status);
        comment.setUpdated_at(LocalDateTime.now());

        comment = commentRepository.save(comment);

        systemLogService.log(
                SystemAction.UPDATE,
                "Update status comment #" + comment.getId()
                        + " -> " + status,
                comment.getUser());

        return CommentResponse.fromEntity(comment);
    }

    // DELETE

    @Transactional
    public void deleteComment(Integer commentId, Integer userId) {

        Comment comment = findComment(commentId);

        if (!comment.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only delete your own comment");
        }

        systemLogService.log(
                SystemAction.DELETE,
                "Delete comment #" + comment.getId(),
                comment.getUser());

        commentRepository.delete(comment);
    }

    // READ

    @Transactional(readOnly = true)
    public List<CommentResponse> getAllComments() {
        return commentRepository.findAll()
                .stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByFoodId(Integer foodId) {
        return commentRepository.findCommentsByFoodId(foodId)
                .stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByComboId(Integer comboId) {
        return commentRepository.findCommentsByComboId(comboId)
                .stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByUserId(Integer userId) {
        return commentRepository.findCommentsByUserId(userId)
                .stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CommentResponse getCommentById(Integer commentId) {
        return CommentResponse.fromEntity(findComment(commentId));
    }

    // HELPERS

    private Comment findComment(Integer id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
    }
}