package com.ngocquang.restautant.modules.statistics.revenue_statistic;

import com.ngocquang.restautant.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api/statistics/revenue")
@RequiredArgsConstructor
public class RevenueStatisticController {

    private final RevenueStatisticService revenueStatisticService;

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<List<MonthlyRevenueDTO>>> getMonthlyRevenue(
            @RequestParam("start")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime start,

            @RequestParam("end")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime end
    ) {

        if (start.isAfter(end)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        List<MonthlyRevenueDTO> result =
                revenueStatisticService.getMonthlyRevenue(start, end);

        return ResponseEntity.ok(
                ApiResponse.success(result, "Fetched monthly revenue successfully")
        );
    }
}