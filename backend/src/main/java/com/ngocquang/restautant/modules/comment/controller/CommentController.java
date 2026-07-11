package com.ngocquang.restautant.modules.comment.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.ngocquang.restautant.common.ApiResponse;
import com.ngocquang.restautant.modules.comment.dto.CommentRequest;
import com.ngocquang.restautant.modules.comment.dto.CommentResponse;
import com.ngocquang.restautant.modules.comment.service.CommentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // CREATE

    @PostMapping("/food/{foodId}")
    public ResponseEntity<ApiResponse<CommentResponse>> createForFood(
            @PathVariable Integer foodId,
            @RequestParam Integer userId,
            @Valid @RequestBody CommentRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        commentService.createCommentForFood(foodId, userId, request),
                        "Create comment successfully",
                        HttpStatus.CREATED.value()));
    }

    @PostMapping("/combo/{comboId}")
    public ResponseEntity<ApiResponse<CommentResponse>> createForCombo(
            @PathVariable Integer comboId,
            @RequestParam Integer userId,
            @Valid @RequestBody CommentRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        commentService.createCommentForCombo(comboId, userId, request),
                        "Create comment successfully",
                        HttpStatus.CREATED.value()));
    }

    // UPDATE

    @PutMapping("/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> update(
            @PathVariable Integer commentId,
            @RequestParam Integer userId,
            @Valid @RequestBody CommentRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        commentService.updateComment(commentId, userId, request),
                        "Update comment successfully"));
    }

    @PutMapping("/{commentId}/status")
    public ResponseEntity<ApiResponse<CommentResponse>> updateStatus(
            @PathVariable Integer commentId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        commentService.updateCommentStatus(
                                commentId,
                                com.ngocquang.restautant.modules.comment.entity.Comment.Status
                                        .valueOf(status.toUpperCase())),
                        "Update comment status successfully"));
    }

    // DELETE

    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Object>> delete(
            @PathVariable Integer commentId,
            @RequestParam Integer userId) {

        commentService.deleteComment(commentId, userId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        null,
                        "Delete comment successfully"));
    }

    // READ

    @GetMapping
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        commentService.getAllComments(),
                        "Get all comments successfully"));
    }

    @GetMapping("/food/{foodId}")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getByFood(
            @PathVariable Integer foodId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        commentService.getCommentsByFoodId(foodId),
                        "Get comments successfully"));
    }

    @GetMapping("/combo/{comboId}")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getByCombo(
            @PathVariable Integer comboId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        commentService.getCommentsByComboId(comboId),
                        "Get comments successfully"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getByUser(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        commentService.getCommentsByUserId(userId),
                        "Get comments successfully"));
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> getById(
            @PathVariable Integer commentId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        commentService.getCommentById(commentId),
                        "Get comment successfully"));
    }
}