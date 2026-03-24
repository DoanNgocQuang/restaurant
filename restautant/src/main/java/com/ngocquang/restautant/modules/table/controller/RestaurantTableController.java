package com.ngocquang.restautant.modules.table.controller;

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
import com.ngocquang.restautant.modules.table.dto.TableRequest;
import com.ngocquang.restautant.modules.table.dto.TableResponse;
import com.ngocquang.restautant.modules.table.service.RestaurantTableService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/tables")
@RequiredArgsConstructor
public class RestaurantTableController {

    private final RestaurantTableService tableService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TableResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(this.tableService.getAllTable(), "Fetched tables successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TableResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(this.tableService.getTableById(id), "Fetched table successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TableResponse>> create(@Valid @RequestBody TableRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(this.tableService.createTable(request), "Created table successfully", HttpStatus.CREATED.value()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TableResponse>> update(@PathVariable Integer id,
            @Valid @RequestBody TableRequest request) {
        return ResponseEntity
                .ok(ApiResponse.success(this.tableService.updateTable(id, request), "Updated table successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        this.tableService.deleteTableById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted table successfully"));
    }
}