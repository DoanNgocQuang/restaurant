package com.ngocquang.restautant.modules.order.repository;

import com.ngocquang.restautant.modules.order.entity.Order;
import com.ngocquang.restautant.modules.order.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    List<OrderDetail> findByOrder(Order order);

    void deleteByOrder(Order order);

    Optional<OrderDetail> findByIdAndOrder(Integer id, Order order);
}