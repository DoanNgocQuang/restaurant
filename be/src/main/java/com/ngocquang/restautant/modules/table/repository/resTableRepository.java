package com.ngocquang.restautant.modules.table.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ngocquang.restautant.modules.table.entity.resTable;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface resTableRepository extends JpaRepository<resTable,Integer> {

    @Query("SELECT t FROM resTable t WHERE t.capacity >= :guests AND t.id NOT IN " +
           "(SELECT bt.id FROM Booking b JOIN b.tables bt " +
           "WHERE b.status != 'CANCELLED' AND b.bookingTime > :startTime AND b.bookingTime < :endTime)")
    List<resTable> findAvailableTables(@Param("guests") int guests, 
                                       @Param("startTime") LocalDateTime startTime, 
                                       @Param("endTime") LocalDateTime endTime);
}
