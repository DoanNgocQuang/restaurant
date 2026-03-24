package com.ngocquang.restautant.modules.voucher.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ngocquang.restautant.common.ApiResponse;
import com.ngocquang.restautant.modules.voucher.dto.VoucherRequest;
import com.ngocquang.restautant.modules.voucher.dto.VoucherResponse;
import com.ngocquang.restautant.modules.voucher.service.VoucherService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<VoucherResponse>>> getAll() {
        return ResponseEntity
                .ok(ApiResponse.success(this.voucherService.fetchVouchers(), "Fetched vouchers successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VoucherResponse>> getVoucherById(@PathVariable Integer id) {
        return ResponseEntity
                .ok(ApiResponse.success(this.voucherService.getVoucherById(id), "Fetched voucher successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VoucherResponse>> createVoucher(@Valid @RequestBody VoucherRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(voucherService.createVoucher(request), "Created voucher successfully", HttpStatus.CREATED.value()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VoucherResponse>> updateVoucher(@PathVariable Integer id,
            @Valid @RequestBody VoucherRequest request) {
        return ResponseEntity
                .ok(ApiResponse.success(voucherService.updateVoucher(id, request), "Updated voucher successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        this.voucherService.deleteVoucherById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted voucher successfully"));
    }
}