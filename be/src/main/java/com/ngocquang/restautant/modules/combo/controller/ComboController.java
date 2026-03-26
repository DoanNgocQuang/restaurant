package com.ngocquang.restautant.modules.combo.controller;

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
import com.ngocquang.restautant.modules.combo.dto.ComboRequest;
import com.ngocquang.restautant.modules.combo.dto.ComboResponse;
import com.ngocquang.restautant.modules.combo.service.ComboService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/combos")
@RequiredArgsConstructor
public class ComboController {

    private final ComboService comboService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ComboResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(comboService.getAllCombo(), "Fetched combos successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ComboResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(comboService.getComboById(id), "Fetched combo successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ComboResponse>> create(@Valid @RequestBody ComboRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(comboService.createCombo(request), "Created combo successfully", HttpStatus.CREATED.value()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ComboResponse>> update(@PathVariable Integer id,
            @Valid @RequestBody ComboRequest request) {
        return ResponseEntity.ok(ApiResponse.success(comboService.updateCombo(id, request), "Updated combo successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        comboService.deleteComboById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted combo successfully"));
    }
}