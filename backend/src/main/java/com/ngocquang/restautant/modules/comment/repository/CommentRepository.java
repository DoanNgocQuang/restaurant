package com.ngocquang.restautant.modules.comment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ngocquang.restautant.modules.comment.entity.Comment;

public interface CommentRepository
        extends JpaRepository<Comment, Integer> {

    @Query("""
        SELECT c
        FROM Comment c
        WHERE c.food.id = :foodId
          AND c.status = 'ACTIVE'
        ORDER BY c.created_at DESC
    """)
    List<Comment> findCommentsByFoodId(
            Integer foodId
    );

    @Query("""
        SELECT c
        FROM Comment c
        WHERE c.food.id = :foodId
        ORDER BY c.created_at DESC
    """)
    List<Comment> findAllCommentsByFoodId(
            Integer foodId
    );

    @Query("""
        SELECT AVG(c.rating)
        FROM Comment c
        WHERE c.food.id = :foodId
          AND c.status = 'ACTIVE'
    """)
    Double getAverageRatingByFoodId(
            Integer foodId
    );

    @Query("""
        SELECT c
        FROM Comment c
        WHERE c.combo.id = :comboId
          AND c.status = 'ACTIVE'
        ORDER BY c.created_at DESC
    """)
    List<Comment> findCommentsByComboId(
            Integer comboId
    );

    @Query("""
        SELECT c
        FROM Comment c
        WHERE c.combo.id = :comboId
        ORDER BY c.created_at DESC
    """)
    List<Comment> findAllCommentsByComboId(
            Integer comboId
    );

    @Query("""
        SELECT AVG(c.rating)
        FROM Comment c
        WHERE c.combo.id = :comboId
          AND c.status = 'ACTIVE'
    """)
    Double getAverageRatingByComboId(
            Integer comboId
    );

    @Query("""
        SELECT c
        FROM Comment c
        WHERE c.user.id = :userId
        ORDER BY c.created_at DESC
    """)
    List<Comment> findCommentsByUserId(
            Integer userId
    );

    @Query("""
        SELECT c
        FROM Comment c
        LEFT JOIN FETCH c.user
        LEFT JOIN FETCH c.food
        LEFT JOIN FETCH c.combo
        ORDER BY c.created_at DESC
    """)
    List<Comment> findAll();
}