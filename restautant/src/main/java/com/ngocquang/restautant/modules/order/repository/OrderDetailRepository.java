package com.ngocquang.restautant.modules.order.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ngocquang.restautant.modules.order.entity.OrderDetail;
import com.ngocquang.restautant.modules.order.entity.Order;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail,Integer> {
    List<OrderDetail> findByOrderId(Integer orderId);

    void deleteByOrderId(Integer orderId);

    void deleteByOrder(Order order);

    Optional<OrderDetail> findByIdAndOrderId(Integer id, Integer orderId);
}
