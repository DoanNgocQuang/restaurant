package com.ngocquang.restautant.modules.booking.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.ngocquang.restautant.modules.booking.entity.Booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Integer id;
    private String contactPhone;
    private String contactName;
    private LocalDateTime bookingTime;
    private Integer guestCount;
    private String note;
    private Booking.Status status;
    private LocalDateTime createdAt;
    private Integer userId;
    private String userFullname;
    private List<TableInfo> tables;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TableInfo {
        private Integer id;
        private Integer capacity;
        private String status;
    }
}