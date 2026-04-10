package com.ngocquang.restautant.modules.statistics.revenue_statistic;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ngocquang.restautant.common.helper.BadRequestException;
import com.ngocquang.restautant.modules.payment.repository.InvoiceRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RevenueStatisticService {

    private final InvoiceRepository invoiceRepository;

    public List<MonthlyRevenueDTO> getMonthlyRevenue(LocalDateTime start, LocalDateTime end) {

        validateDateRange(start, end);

        List<Object[]> rows = invoiceRepository.getRevenueByMonth(start, end);

        return rows.stream().map(r ->
            MonthlyRevenueDTO.builder()
                .month((String) r[0])
                .totalInvoices(((Number) r[1]).longValue())
                .totalGuests(((Number) r[2]).longValue())
                .totalRevenue(new BigDecimal(r[3].toString()))
                .build()
        ).toList();
    }

    private void validateDateRange(LocalDateTime start, LocalDateTime end) {

        if (start == null || end == null) {
            throw new BadRequestException("Start and end time must not be null");
        }

        if (start.isAfter(end)) {
            throw new BadRequestException("Start time must be before end time");
        }
    }
}