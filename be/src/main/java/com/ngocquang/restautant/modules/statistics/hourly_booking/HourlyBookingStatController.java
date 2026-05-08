package com.ngocquang.restautant.modules.statistics.hourly_booking;

import com.ngocquang.restautant.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/statistics/bookings")
@RequiredArgsConstructor
public class HourlyBookingStatController {

    private final HourlyBookingStatService hourlyBookingStatService;

    @GetMapping("/by-hour")
    public ResponseEntity<ApiResponse<List<HourlyBookingStatDTO>>> getBookingsByHour(
            @RequestParam("month") int month,
            @RequestParam("year") int year
    ) {
        List<HourlyBookingStatDTO> result =
                hourlyBookingStatService.getBookingStatsByHour(month, year);

        return ResponseEntity.ok(
                ApiResponse.success(result, "Fetched hourly booking statistics successfully")
        );
    }
}
