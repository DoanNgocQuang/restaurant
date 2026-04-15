package com.ngocquang.restautant.modules.order.service;

import com.ngocquang.restautant.common.helper.BadRequestException;
import com.ngocquang.restautant.common.helper.ResourceNotFoundException;
import com.ngocquang.restautant.common.CurrentUserUtil;
import com.ngocquang.restautant.modules.booking.entity.Booking;
import com.ngocquang.restautant.modules.booking.repository.BookingRepository;
import com.ngocquang.restautant.modules.combo.entity.Combo;
import com.ngocquang.restautant.modules.combo.repository.ComboRepository;
import com.ngocquang.restautant.modules.food.entity.Food;
import com.ngocquang.restautant.modules.food.repository.FoodRepository;
import com.ngocquang.restautant.modules.order.dto.*;
import com.ngocquang.restautant.modules.order.entity.*;
import com.ngocquang.restautant.modules.order.repository.OrderRepository;
import com.ngocquang.restautant.modules.systemlog.entity.SystemAction;
import com.ngocquang.restautant.modules.systemlog.service.SystemLogService;
import com.ngocquang.restautant.modules.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final BookingRepository bookingRepository;
    private final FoodRepository foodRepository;
    private final ComboRepository comboRepository;
    private final CurrentUserUtil currentUserUtil;
    private final SystemLogService systemLogService;

    @Transactional
    public OrderDto createOrder(OrderCreateDto request) {

        User user = currentUserUtil.getCurrentUser();
        Booking booking = resolveBooking(user);

        Order order = initOrder(user, booking);

        BigDecimal total = buildOrderDetails(order, request.getOrderDetails());
        order.setTotal_amount(total);

        order = orderRepository.save(order);

        systemLogService.log(
                SystemAction.CREATE,
                "Tạo order #" + order.getId()
                        + " | Tổng tiền: " + total
                        + " | Số món: " + order.getOrderDetails().size(),
                user
        );

        return getOrderWithDetails(order.getId());
    }

    public OrderDto getOrderById(Integer id) {

        Order order = findOrderWithDetails(id);

        return mapToDto(order);
    }

    public List<OrderDto> getOrdersByUser() {

        User user = currentUserUtil.getCurrentUser();

        return orderRepository.findByUserWithDetails(user)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    private Order initOrder(User user, Booking booking) {
        return Order.builder()
                .user(user)
                .booking(booking)
                .status(OrderStatus.CONFIRMED)
                .total_amount(BigDecimal.ZERO)
                .build();
    }

    private BigDecimal buildOrderDetails(Order order, List<OrderDetailCreateDto> items) {

        if (items == null || items.isEmpty()) {
            throw new BadRequestException("Order must have at least 1 item");
        }

        BigDecimal total = BigDecimal.ZERO;

        for (OrderDetailCreateDto item : items) {

            OrderDetail detail = createOrderDetail(item);

            order.addDetail(detail);

            total = total.add(
                    detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity()))
            );
        }

        return total;
    }

    private OrderDetail createOrderDetail(OrderDetailCreateDto item) {

        if (item.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }

        OrderDetail detail = new OrderDetail();
        detail.setQuantity(item.getQuantity());

        BigDecimal price = resolveItem(detail, item);
        detail.setPrice(price);

        return detail;
    }

    private BigDecimal resolveItem(OrderDetail detail, OrderDetailCreateDto item) {

        if (item.getFoodId() != null) {
            Food food = foodRepository.findById(item.getFoodId())
                    .orElseThrow(() -> new ResourceNotFoundException("Food not found"));

            detail.setFood(food);
            return food.getPrice();
        }

        if (item.getComboId() != null) {
            Combo combo = comboRepository.findById(item.getComboId())
                    .orElseThrow(() -> new ResourceNotFoundException("Combo not found"));

            detail.setCombo(combo);
            return combo.getPrice();
        }

        throw new BadRequestException("Item must have foodId or comboId");
    }

    private Booking resolveBooking(User user) {
        return bookingRepository
                .findByUserAndStatusOrderByBookingTimeDesc(user, Booking.Status.PENDING)
                .stream()
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Bạn chưa có booking hợp lệ"));
    }

    private Order findOrderWithDetails(Integer id) {
        return orderRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    private OrderDto getOrderWithDetails(Integer id) {
        return mapToDto(findOrderWithDetails(id));
    }

    @Transactional
    public OrderDto updateStatus(Integer id, OrderStatus status) {

        User user = currentUserUtil.getCurrentUser();

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(status);

        order = orderRepository.save(order);

        systemLogService.log(
                SystemAction.UPDATE,
                "Update order #" + id + " status: " + status,
                user
        );

        return mapToDto(order);
    }

    private OrderDto mapToDto(Order order) {

        List<OrderDetailDto> details = order.getOrderDetails()
                .stream()
                .map(this::mapDetail)
                .toList();

        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .bookingId(order.getBooking().getId())
                .status(order.getStatus())
                .createdAt(order.getCreated_at())
                .totalAmount(order.getTotal_amount())
                .orderDetails(details)
                .build();
    }

    private OrderDetailDto mapDetail(OrderDetail d) {
        return OrderDetailDto.builder()
                .id(d.getId())
                .orderId(d.getOrder().getId())
                .foodId(d.getFood() != null ? d.getFood().getId() : null)
                .comboId(d.getCombo() != null ? d.getCombo().getId() : null)
                .price(d.getPrice())
                .quantity(d.getQuantity())
                .build();
    }
}