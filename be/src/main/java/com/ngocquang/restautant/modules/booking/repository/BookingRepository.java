package com.ngocquang.restautant.modules.booking.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ngocquang.restautant.modules.booking.entity.Booking;
import com.ngocquang.restautant.modules.user.entity.User;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
        List<Booking> findByUserId(Integer userId);

        boolean existsByTables_IdAndStatusIn(Integer tableId, Collection<Booking.Status> statuses);

        boolean existsByTables_IdAndStatusInAndIdNot(Integer tableId, Collection<Booking.Status> statuses, Integer id);

        List<Booking> findByUserAndStatusOrderByBookingTimeDesc(User user, Booking.Status status);

        @Query(value = "SELECT EXISTS (" +
                        "   SELECT 1 FROM booking b " +
                        "   JOIN booked_table bt ON b.id = bt.booking_id " +
                        "   WHERE bt.table_id = :tableId " +
                        "   AND b.status IN ('PENDING', 'CONFIRMED') " +
                        "   AND b.booking_time < :endTime " +
                        "   AND DATE_ADD(b.booking_time, INTERVAL b.duration_minutes MINUTE) > :startTime " +
                        "   AND (:currentBookingId IS NULL OR b.id != :currentBookingId)" +
                        ")", nativeQuery = true)
        Long existsTimeConflict(
                        @Param("tableId") Integer tableId,
                        @Param("startTime") LocalDateTime startTime,
                        @Param("endTime") LocalDateTime endTime,
                        @Param("currentBookingId") Integer currentBookingId);

        @Query("SELECT b FROM Booking b JOIN b.tables t " +
                        "WHERE t.id = :tableId " +
                        "AND b.status = 'CONFIRMED' " +
                        "AND b.bookingTime <= :now")
        List<Booking> findConfirmedBookingsByTableAndTime(
                        @Param("tableId") Integer tableId,
                        @Param("now") LocalDateTime now);
}