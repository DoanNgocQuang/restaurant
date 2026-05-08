package com.ngocquang.restautant.modules.statistics.hourly_booking;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ngocquang.restautant.common.helper.BadRequestException;
import com.ngocquang.restautant.modules.booking.repository.BookingRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HourlyBookingStatService {

    private final BookingRepository bookingRepository;

    public List<HourlyBookingStatDTO> getBookingStatsByHour(int month, int year) {

        if (month < 1 || month > 12) {
            throw new BadRequestException("Month must be between 1 and 12");
        }
        if (year < 2000 || year > 2100) {
            throw new BadRequestException("Year must be between 2000 and 2100");
        }

        List<Object[]> rows = bookingRepository.getBookingStatsByHour(month, year);

        return rows.stream().map(r -> {
            int hour = ((Number) r[0]).intValue();
            long totalBookings = ((Number) r[1]).longValue();
            long totalGuests = ((Number) r[2]).longValue();
            double avg = totalBookings > 0 ? (double) totalGuests / totalBookings : 0;

            String hourLabel = String.format("%02d:00 - %02d:00", hour, (hour + 1) % 24);

            return HourlyBookingStatDTO.builder()
                    .hourLabel(hourLabel)
                    .hour(hour)
                    .totalBookings(totalBookings)
                    .totalGuests(totalGuests)
                    .avgGuestsPerBooking(Math.round(avg * 10.0) / 10.0)
                    .build();
        }).toList();
    }
}
