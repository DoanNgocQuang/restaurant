package com.ngocquang.restautant.modules.checkout.service;

import com.ngocquang.restautant.common.CurrentUserUtil;
import com.ngocquang.restautant.common.helper.BadRequestException;
import com.ngocquang.restautant.common.helper.ResourceNotFoundException;
import com.ngocquang.restautant.modules.checkout.dto.CheckoutRequestDto;
import com.ngocquang.restautant.modules.order.dto.OrderDto;
import com.ngocquang.restautant.modules.order.dto.OrderDetailDto;
import com.ngocquang.restautant.modules.order.entity.Order;
import com.ngocquang.restautant.modules.order.entity.OrderDetail;
import com.ngocquang.restautant.modules.order.entity.OrderStatus;
import com.ngocquang.restautant.modules.order.repository.OrderRepository;
import com.ngocquang.restautant.modules.systemlog.entity.SystemAction;
import com.ngocquang.restautant.modules.systemlog.service.SystemLogService;
import com.ngocquang.restautant.modules.user.entity.User;
import com.ngocquang.restautant.modules.voucher.entity.Voucher;
import com.ngocquang.restautant.modules.voucher.entity.VoucherDetail;
import com.ngocquang.restautant.modules.voucher.repository.VoucherDetailRepository;
import com.ngocquang.restautant.modules.voucher.repository.VoucherRepository;
import com.ngocquang.restautant.modules.voucher.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final OrderRepository orderRepository;
    private final CurrentUserUtil currentUserUtil;
    private final SystemLogService systemLogService;
    private final VoucherRepository voucherRepository;
    private final VoucherDetailRepository voucherDetailRepository;

    private final VoucherService voucherService;

    @Transactional
    public OrderDto processCheckout(CheckoutRequestDto request) {
        User user = currentUserUtil.getCurrentUser();

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You do not have permission to checkout this order");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Order is currently in " + order.getStatus() + " status, unable to checkout");
        }

        if (request.getVoucherCode() != null && !request.getVoucherCode().trim().isEmpty()) {
            Voucher voucher = voucherRepository.findByCode(request.getVoucherCode())
                    .orElseThrow(() -> new ResourceNotFoundException("Voucher not found"));

            voucherService.validateVoucherEligibility(voucher, user);

            LocalDateTime now = LocalDateTime.now();
            BigDecimal discountAmt = BigDecimal.ZERO;
            if (voucher.getDiscountType() == Voucher.DiscountType.PERCENT) {
                discountAmt = order.getTotal_amount().multiply(voucher.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
            } else {
                discountAmt = voucher.getDiscountValue();
            }

            BigDecimal newTotal = order.getTotal_amount().subtract(discountAmt);
            if (newTotal.compareTo(BigDecimal.ZERO) < 0) {
                newTotal = BigDecimal.ZERO;
            }
            order.setTotal_amount(newTotal);

            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepository.save(voucher);

            VoucherDetail detail = VoucherDetail.builder()
                    .voucher(voucher)
                    .user(user)
                    .used(true)
                    .usedAt(now)
                    .build();
            voucherDetailRepository.save(detail);

            systemLogService.log(
                    SystemAction.CREATE,
                    "Áp dụng Voucher " + voucher.getCode() + " cho Order #" + order.getId(),
                    user
            );
        }

        order = orderRepository.save(order);

        systemLogService.log(
                SystemAction.UPDATE,
                "Checkout submitted for order #" + order.getId() + " via " + request.getPaymentMethod() + " | trạng thái giữ ở PENDING",
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
                .itemName(d.getFood() != null ? d.getFood().getName() : (d.getCombo() != null ? d.getCombo().getName() : "Unknown"))
                .price(d.getPrice())
                .quantity(d.getQuantity())
                .build();
    }
}
