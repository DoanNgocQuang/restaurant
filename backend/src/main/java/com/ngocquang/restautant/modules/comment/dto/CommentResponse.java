package com.ngocquang.restautant.modules.comment.dto;

import java.time.LocalDateTime;

import com.ngocquang.restautant.modules.comment.entity.Comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {

    private Integer id;

    private String content;

    private Integer rating;

    private String status;

    private LocalDateTime created_at;

    private LocalDateTime updated_at;

    private Integer userId;

    private String userName;

    private Integer foodId;

    private String foodName;

    private Integer comboId;

    private String comboName;

    public static CommentResponse fromEntity(
            Comment comment) {

        return CommentResponse.builder()
                .id(comment.getId())

                .content(comment.getContent())

                .rating(comment.getRating())

                .status(
                    comment.getStatus() != null
                        ? comment.getStatus().name()
                        : null
                )

                .created_at(
                    comment.getCreated_at()
                )

                .updated_at(
                    comment.getUpdated_at()
                )

                .userId(
                    comment.getUser() != null
                        ? comment.getUser().getId()
                        : null
                )

                .userName(
                    comment.getUser() != null
                        ? comment.getUser().getFullname()
                        : null
                )

                .foodId(
                    comment.getFood() != null
                        ? comment.getFood().getId()
                        : null
                )

                .foodName(
                    comment.getFood() != null
                        ? comment.getFood().getName()
                        : null
                )

                .comboId(
                    comment.getCombo() != null
                        ? comment.getCombo().getId()
                        : null
                )

                .comboName(
                    comment.getCombo() != null
                        ? comment.getCombo().getName()
                        : null
                )

                .build();
    }
}