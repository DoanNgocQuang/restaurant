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
        SELECT o FROM Order o 
        LEFT JOIN FETCH o.orderDetails 
        WHERE o.id = :id
    """)
    Optional<Order> findByIdWithDetails(Integer id);

    @Query("""
        SELECT o FROM Order o
        LEFT JOIN FETCH o.orderDetails
        WHERE o.user = :user
    """)
    List<Order> findByUserWithDetails(User user);
}