package com.ngocquang.restautant.modules.table.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ngocquang.restautant.modules.booking.entity.Booking;
import com.ngocquang.restautant.modules.booking.repository.BookingRepository;
import com.ngocquang.restautant.modules.table.entity.resTable;
import com.ngocquang.restautant.modules.table.repository.resTableRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TableStatusScheduler {

    private final resTableRepository tableRepository;
    private final BookingRepository bookingRepository;

    /**
     * Check every minute if any RESERVED table should become OCCUPIED
     * (when booking time has arrived)
     */
    @Scheduled(fixedDelay = 60000, initialDelay = 60000)
    @Transactional
    public void updateReservedToOccupied() {
        LocalDateTime now = LocalDateTime.now();

        // Find all tables that are RESERVED
        List<resTable> reservedTables = tableRepository.findByStatus(resTable.Status.RESERVED);

        for (resTable table : reservedTables) {
            // Find CONFIRMED bookings for this table with bookingTime <= now
            List<Booking> activeBookings = bookingRepository.findConfirmedBookingsByTableAndTime(table.getId(), now);

            if (!activeBookings.isEmpty()) {
                // If there are confirmed bookings that have started, mark table as OCCUPIED
                table.setStatus(resTable.Status.OCCUPIED);
                table.setOccupiedAt(now);
                table.setReservedAt(null);
                tableRepository.save(table);
                log.info("Table {} changed to OCCUPIED", table.getId());
            }
        }
    }

    /**
     * Check every minute if any OCCUPIED table should become AVAILABLE
     * (after 90 minutes of being occupied)
     */
    @Scheduled(fixedDelay = 60000, initialDelay = 60000)
    @Transactional
    public void updateOccupiedToAvailable() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime ninetyMinutesAgo = now.minusMinutes(90);

        // Find all tables that are OCCUPIED
        List<resTable> occupiedTables = tableRepository.findByStatus(resTable.Status.OCCUPIED);

        for (resTable table : occupiedTables) {
            if (table.getOccupiedAt() != null && table.getOccupiedAt().isBefore(ninetyMinutesAgo)) {
                // If occupied for more than 90 minutes, mark as AVAILABLE
                table.setStatus(resTable.Status.AVAILABLE);
                table.setOccupiedAt(null);
                table.setReservedAt(null);
                tableRepository.save(table);
                log.info("Table {} changed to AVAILABLE after 90 minutes", table.getId());
            }
        }
    }
}
