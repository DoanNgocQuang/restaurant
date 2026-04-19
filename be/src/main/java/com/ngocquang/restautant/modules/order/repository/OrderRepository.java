package com.ngocquang.restautant.modules.order.repository;

import com.ngocquang.restautant.modules.order.entity.Order;
import com.ngocquang.restautant.modules.order.entity.OrderStatus;
import com.ngocquang.restautant.modules.user.entity.User;
import com.ngocquang.restautant.modules.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByBooking(Booking booking);

    List<Order> findByUser(User user);

    List<Order> findByStatusNot(OrderStatus status);

    List<Order> findByBookingAndStatusNot(Booking booking, OrderStatus status);

    Optional<Order> findFirstByUserAndStatus(User user, OrderStatus status);

    @Query("""
        SELECT DISTINCT o FROM Order o
        LEFT JOIN FETCH o.user
        LEFT JOIN FETCH o.booking b
        LEFT JOIN FETCH o.orderDetails od
        LEFT JOIN FETCH od.food
        LEFT JOIN FETCH od.combo
        WHERE o.id = :id
    """)
    Optional<Order> findByIdWithDetails(Integer id);

    @Query("""
        SELECT DISTINCT o FROM Order o
        LEFT JOIN FETCH o.user
        LEFT JOIN FETCH o.booking b
        LEFT JOIN FETCH o.orderDetails od
        LEFT JOIN FETCH od.food
        LEFT JOIN FETCH od.combo
        WHERE o.user = :user
        ORDER BY o.created_at DESC
    """)
    List<Order> findByUserWithDetails(User user);

    @Query("""
        SELECT DISTINCT o FROM Order o
        LEFT JOIN FETCH o.user
        LEFT JOIN FETCH o.booking b
        LEFT JOIN FETCH o.orderDetails od
        LEFT JOIN FETCH od.food
        LEFT JOIN FETCH od.combo
        ORDER BY o.created_at DESC
    """)
    List<Order> findAllWithDetails();

    @Query(value = """
        SELECT f.id as foodId, f.name as foodName, f.price as price, SUM(od.quantity) as totalSold
        FROM order_detail od
        JOIN food f ON od.food_id = f.id
        JOIN orders o ON od.order_id = o.id
        WHERE o.status = 'CONFIRMED'
        AND YEAR(o.created_at) = :year
        AND MONTH(o.created_at) = :month
        GROUP BY f.id, f.name, f.price
        ORDER BY totalSold DESC
        LIMIT 50
    """, nativeQuery = true)
    List<com.ngocquang.restautant.modules.order.dto.TopSellingFoodProjection> findTopSellingFoods(@org.springframework.data.repository.query.Param("month") Integer month, @org.springframework.data.repository.query.Param("year") Integer year);
}
