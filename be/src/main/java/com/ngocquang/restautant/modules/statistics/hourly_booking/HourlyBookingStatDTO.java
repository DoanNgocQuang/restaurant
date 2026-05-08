package com.ngocquang.restautant.modules.statistics.hourly_booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HourlyBookingStatDTO {

    private String hourLabel;
    private Integer hour;
    private Long totalBookings;
    private Long totalGuests;
    private Double avgGuestsPerBooking;
}
