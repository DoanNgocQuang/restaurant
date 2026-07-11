package com.ngocquang.restautant.modules.checkout.service;

import com.ngocquang.restautant.common.CurrentUserUtil;
import com.ngocquang.restautant.common.helper.BadRequestException;
import com.ngocquang.restautant.common.helper.ResourceNotFoundException;
import com.ngocquang.restautant.modules.checkout.dto.CheckoutRequestDto;
import com.ngocquang.restautant.modules.payment.entity.Invoice;
import com.ngocquang.restautant.modules.payment.entity.Payment;
import com.ngocquang.restautant.modules.payment.repository.InvoiceRepository;
import com.ngocquang.restautant.modules.payment.repository.PaymentRepository;
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
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final VoucherRepository voucherRepository;
    private final VoucherDetailRepository voucherDetailRepository;

    private final VoucherService voucherService;

    private Payment.Method resolvePaymentMethod(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.isBlank()) {
            throw new BadRequestException("Payment method cannot be blank");
        }

        String normalizedMethod = paymentMethod.trim().toUpperCase();
        return switch (normalizedMethod) {
            case "CASH" -> Payment.Method.CASH;
            case "BANK_TRANSFER", "VNPAY" -> Payment.Method.BANK_TRANSFER;
            default -> throw new BadRequestException("Unsupported payment method: " + paymentMethod);
        };
    }

    private BigDecimal calculateBookingTotal(Order order) {
        if (order.getBooking() == null) {
            throw new BadRequestException("Order does not have a booking, unable to create invoice");
        }

        return orderRepository.findByBookingAndStatusNot(order.getBooking(), OrderStatus.CANCELLED)
                .stream()
                .map(Order::getTotal_amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Invoice upsertInvoice(Order order, BigDecimal totalAmount, Voucher voucher) {
        Integer bookingId = order.getBooking().getId();
        Invoice invoice = invoiceRepository.findByBooking_Id(bookingId)
                .orElseGet(() -> Invoice.builder()
                        .booking(order.getBooking())
                        .createdAt(LocalDateTime.now())
                        .build());

        invoice.setBooking(order.getBooking());
        invoice.setTotalAmount(totalAmount);
        invoice.setVoucher(voucher);
        return invoiceRepository.save(invoice);
    }

    private Payment upsertPayment(Invoice invoice, BigDecimal amount, Payment.Method method) {
        Payment payment = paymentRepository.findByInvoice_Id(invoice.getId())
                .orElseGet(() -> Payment.builder()
                        .invoice(invoice)
                        .paidAt(LocalDateTime.now())
                        .build());

        payment.setInvoice(invoice);
        payment.setMethod(method);
        payment.setAmount(amount);
        payment.setPaidAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    @Transactional
    public OrderDto processCheckout(CheckoutRequestDto request) {
        User user = currentUserUtil.getCurrentUser();
        Payment.Method paymentMethod = resolvePaymentMethod(request.getPaymentMethod());

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You do not have permission to checkout this order");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Order is currently in " + order.getStatus() + " status, unable to checkout");
        }

        Voucher appliedVoucher = null;
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

            appliedVoucher = voucher;
        }

        order = orderRepository.save(order);
        BigDecimal bookingTotal = calculateBookingTotal(order);
        Invoice invoice = upsertInvoice(order, bookingTotal, appliedVoucher);
        Payment payment = upsertPayment(invoice, bookingTotal, paymentMethod);

        systemLogService.log(
                SystemAction.UPDATE,
                "Checkout created invoice #" + invoice.getId()
                        + " and payment #" + payment.getId()
                        + " for order #" + order.getId()
                        + " via " + paymentMethod
                        + " | trạng thái order giữ ở PENDING",
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
