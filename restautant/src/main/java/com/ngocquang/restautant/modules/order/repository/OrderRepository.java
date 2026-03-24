package com.ngocquang.restautant.modules.order.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ngocquang.restautant.modules.order.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer> {
    List<Order> findByBookingId(Integer bookingId);

    List<Order> findByStatusNot(Order.Status status);

    List<Order> findByBookingIdAndStatusNot(Integer bookingId, Order.Status status);

    Optional<Order> findFirstByUserIdAndStatus(Integer userId, Order.Status status);
}
