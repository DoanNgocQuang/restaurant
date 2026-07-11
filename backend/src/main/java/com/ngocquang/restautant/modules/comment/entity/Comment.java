package com.ngocquang.restautant.modules.comment.entity;

import java.time.LocalDateTime;

import com.ngocquang.restautant.modules.combo.entity.Combo;
import com.ngocquang.restautant.modules.food.entity.Food;
import com.ngocquang.restautant.modules.user.entity.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(
        nullable = false,
        columnDefinition = "TEXT"
    )
    private String content;

    @Column(nullable = false)
    private Integer rating;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false)
    private LocalDateTime created_at;

    @Column(nullable = false)
    private LocalDateTime updated_at;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id",
        nullable = false
    )
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id")
    private Food food;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combo_id")
    private Combo combo;

    public enum Status {
        ACTIVE,
        HIDDEN
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now =
                LocalDateTime.now();

        this.created_at = now;
        this.updated_at = now;

        if (this.status == null) {
            this.status = Status.ACTIVE;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updated_at =
                LocalDateTime.now();
    }
}