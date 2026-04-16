package com.ngocquang.restautant.modules.table.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ngocquang.restautant.modules.table.entity.resTable;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface resTableRepository extends JpaRepository<resTable, Integer> {

       @Query(nativeQuery = true, value = "SELECT DISTINCT t.id, t.name, t.description, t.capacity, t.status, t.reserved_at, t.occupied_at "
                     +
                     "FROM res_table t " +
                     "WHERE t.capacity >= :guests " +
                     "AND t.id NOT IN ( " +
                     "  SELECT DISTINCT t2.id FROM res_table t2 " +
                     "  JOIN booked_table bt ON t2.id = bt.table_id " +
                     "  JOIN booking b ON bt.booking_id = b.id " +
                     "  WHERE b.status IN ('PENDING', 'CONFIRMED') " +
                     "  AND b.booking_time < :endTime " +
                     "  AND DATE_ADD(b.booking_time, INTERVAL b.duration_minutes MINUTE) > :startTime" +
                     ") " +
                     "AND t.id NOT IN ( " +
                     "  SELECT id FROM res_table " +
                     "  WHERE status = 'OCCUPIED' AND occupied_at IS NOT NULL " +
                     "  AND occupied_at < :endTime " +
                     "  AND DATE_ADD(occupied_at, INTERVAL 90 MINUTE) > :startTime" +
                     ")")
       List<resTable> findAvailableTables(@Param("guests") int guests,
                     @Param("startTime") java.time.LocalDateTime startTime,
                     @Param("endTime") java.time.LocalDateTime endTime);

       List<resTable> findByStatus(resTable.Status status);
}
