package com.ngocquang.restautant.modules.voucher.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ngocquang.restautant.common.helper.BadRequestException;
import com.ngocquang.restautant.common.helper.ResourceNotFoundException;
import com.ngocquang.restautant.modules.voucher.dto.VoucherRequest;
import com.ngocquang.restautant.modules.voucher.dto.VoucherResponse;
import com.ngocquang.restautant.modules.voucher.entity.Voucher;
import com.ngocquang.restautant.modules.voucher.repository.VoucherDetailRepository;
import com.ngocquang.restautant.modules.voucher.repository.VoucherRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VoucherRepository voucherRepository;
    private final VoucherDetailRepository voucherDetailRepository;

    private VoucherResponse toResponse(Voucher voucher) {
        return VoucherResponse.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .discountValue(voucher.getDiscountValue())
                .startDate(voucher.getStartDate())
                .endDate(voucher.getEndDate())
                .quantity(voucher.getQuantity())
                .discountType(voucher.getDiscountType())
                .usedUserCount(voucherDetailRepository.countDistinctUsedUsersByVoucherId(voucher.getId()))
                .build();
    }

    private void requestToEntity(Voucher voucher, VoucherRequest request) {
        voucher.setCode(request.getCode());
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setStartDate(request.getStartDate() != null ? request.getStartDate() : LocalDateTime.now());
        voucher.setEndDate(request.getEndDate());
        voucher.setQuantity(request.getQuantity());
        voucher.setDiscountType(
                request.getDiscountType() != null ? request.getDiscountType() : Voucher.DiscountType.FIXED);
    }

    private void validateDates(LocalDateTime startDate, LocalDateTime endDate) {
        LocalDateTime effectiveStart = startDate != null ? startDate : LocalDateTime.now();
        if (endDate.isBefore(effectiveStart)) {
            throw new BadRequestException("End date must be after start date");
        }
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity < 1) {
            throw new BadRequestException("Quantity must be greater than 0");
        }
    }

    public List<VoucherResponse> fetchVouchers() {
        return voucherRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public VoucherResponse getVoucherById(Integer id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with id: " + id));
        return toResponse(voucher);
    }

    public VoucherResponse createVoucher(VoucherRequest request) {
        if (voucherRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Voucher code already exists: " + request.getCode());
        }

        validateDates(request.getStartDate(), request.getEndDate());
        validateQuantity(request.getQuantity());

        Voucher voucher = new Voucher();
        requestToEntity(voucher, request);
        return toResponse(voucherRepository.save(voucher));
    }

    public VoucherResponse updateVoucher(Integer id, VoucherRequest request) {
        Voucher voucherInDb = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with id: " + id));

        if (!voucherInDb.getCode().equalsIgnoreCase(request.getCode())
                && voucherRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Voucher code already exists: " + request.getCode());
        }

        validateDates(request.getStartDate(), request.getEndDate());
        validateQuantity(request.getQuantity());

        requestToEntity(voucherInDb, request);
        return toResponse(voucherRepository.save(voucherInDb));
    }

    public VoucherResponse validateVoucherByCode(String code) {
        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with code: " + code));

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate())) {
            throw new BadRequestException("Voucher is expired or not yet active");
        }

        if (voucher.getQuantity() <= 0) {
            throw new BadRequestException("Voucher is out of stock");
        }

        return toResponse(voucher);
    }

    public void deleteVoucherById(Integer id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with id: " + id));
        voucherRepository.delete(voucher);
    }
}
