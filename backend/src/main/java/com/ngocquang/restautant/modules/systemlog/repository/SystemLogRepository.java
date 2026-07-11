package com.ngocquang.restautant.modules.systemlog.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ngocquang.restautant.modules.systemlog.entity.SystemAction;
import com.ngocquang.restautant.modules.systemlog.entity.SystemLog;

public interface SystemLogRepository extends JpaRepository<SystemLog, Integer> {

    @Query(
        value = """
            SELECT l FROM SystemLog l
            LEFT JOIN FETCH l.user
            WHERE (:action IS NULL OR l.action = :action)
            AND (
                :keyword IS NULL OR
                l.detail LIKE CONCAT('%', :keyword, '%') OR
                LOWER(l.user.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            AND (:fromDate IS NULL OR l.loggedAt >= :fromDate)
            AND (:toDate IS NULL OR l.loggedAt <= :toDate)
        """,
        countQuery = """
            SELECT COUNT(l) FROM SystemLog l
            LEFT JOIN l.user
            WHERE (:action IS NULL OR l.action = :action)
            AND (
                :keyword IS NULL OR
                l.detail LIKE CONCAT('%', :keyword, '%') OR
                LOWER(l.user.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            AND (:fromDate IS NULL OR l.loggedAt >= :fromDate)
            AND (:toDate IS NULL OR l.loggedAt <= :toDate)
        """
    )
    Page<SystemLog> search(
        SystemAction action,
        String keyword,
        LocalDateTime fromDate,
        LocalDateTime toDate,
        Pageable pageable
    );
}