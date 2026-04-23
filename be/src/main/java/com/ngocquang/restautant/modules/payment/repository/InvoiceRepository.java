package com.ngocquang.restautant.modules.payment.repository;

import com.ngocquang.restautant.modules.payment.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    Optional<Invoice> findByBooking_Id(Integer bookingId);

    @Query(value = """
        SELECT 
            DATE_FORMAT(i.created_at, '%Y-%m') AS month,
            COUNT(i.id) AS totalInvoices,
            COALESCE(SUM(b.guest_count), 0) AS totalGuests,
            COALESCE(SUM(p.amount), 0) AS totalRevenue
        FROM invoice i
        LEFT JOIN booking b ON b.id = i.booking_id
        LEFT JOIN payment p ON p.invoice_id = i.id
        LEFT JOIN orders o ON o.booking_id = b.id
        WHERE i.created_at BETWEEN :start AND :end
        AND o.status = 'CONFIRMED'
        GROUP BY DATE_FORMAT(i.created_at, '%Y-%m')
        ORDER BY month
    """, nativeQuery = true)
    List<Object[]> getRevenueByMonth(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
