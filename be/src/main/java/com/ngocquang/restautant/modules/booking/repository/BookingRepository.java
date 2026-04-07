package com.ngocquang.restautant.modules.booking.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ngocquang.restautant.modules.booking.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserId(Integer userId);

    boolean existsByTables_IdAndStatusIn(Integer tableId, Collection<Booking.Status> statuses);

    boolean existsByTables_IdAndStatusInAndIdNot(Integer tableId, Collection<Booking.Status> statuses, Integer id);
}