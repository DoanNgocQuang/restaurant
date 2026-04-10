package com.ngocquang.restautant.modules.systemlog.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ngocquang.restautant.common.ApiResponse;
import com.ngocquang.restautant.modules.systemlog.dto.SystemLogDTO;
import com.ngocquang.restautant.modules.systemlog.service.SystemLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/system-logs")
@RequiredArgsConstructor
public class SystemLogController {

    private final SystemLogService systemLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SystemLogDTO>>> getAllLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        systemLogService.getAllLogs(action, keyword, from, to, pageable),
                        "Fetched system logs successfully"
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SystemLogDTO>> getLogById(@PathVariable Integer id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        systemLogService.getById(id),
                        "Fetched system log successfully"
                )
        );
    }
}