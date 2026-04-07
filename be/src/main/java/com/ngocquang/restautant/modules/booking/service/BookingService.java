package com.ngocquang.restautant.modules.booking.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ngocquang.restautant.common.helper.BadRequestException;
import com.ngocquang.restautant.common.helper.ResourceNotFoundException;
import com.ngocquang.restautant.modules.booking.dto.BookingRequest;
import com.ngocquang.restautant.modules.booking.dto.BookingResponse;
import com.ngocquang.restautant.modules.booking.entity.Booking;
import com.ngocquang.restautant.modules.booking.repository.BookingRepository;
import com.ngocquang.restautant.modules.table.entity.resTable;
import com.ngocquang.restautant.modules.table.repository.resTableRepository;
import com.ngocquang.restautant.modules.user.entity.User;
import com.ngocquang.restautant.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final List<Booking.Status> ACTIVE_STATUSES = List.of(Booking.Status.PENDING, Booking.Status.CONFIRMED);

    private final BookingRepository bookingRepository;
    private final resTableRepository tableRepository;
    private final UserRepository userRepository;

    private BookingResponse toResponse(Booking booking) {
        List<BookingResponse.TableInfo> tableInfos = booking.getTables() == null ? List.of()
                : booking.getTables().stream()
                        .map(table -> BookingResponse.TableInfo.builder()
                                .id(table.getId())
                                .capacity(table.getCapacity())
                                .status(table.getStatus().name())
                                .build())
                        .collect(Collectors.toList());

        return BookingResponse.builder()
                .id(booking.getId())
                .contactPhone(booking.getContactPhone())
                .contactName(booking.getContactName())
                .bookingTime(booking.getBookingTime())
                .guestCount(booking.getGuestCount())
                .note(booking.getNote())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .userId(booking.getUser() != null ? booking.getUser().getId() : null)
                .userFullname(booking.getUser() != null ? booking.getUser().getFullname() : null)
                .tables(tableInfos)
                .build();
    }

    private void requestToEntity(Booking booking, BookingRequest request, User user, List<resTable> tables) {
        booking.setContactPhone(request.getContactPhone().trim());
        booking.setContactName(request.getContactName().trim());
        booking.setBookingTime(request.getBookingTime());
        booking.setGuestCount(request.getGuestCount());
        booking.setNote(request.getNote().trim());
        booking.setStatus(request.getStatus() != null ? request.getStatus() : Booking.Status.PENDING);
        booking.setUser(user);
        booking.setTables(tables);
    }

    private User resolveUser(Integer userId) {
        if (userId == null) {
            return null;
        }

        return this.userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private List<resTable> resolveTables(List<Integer> tableIds, Integer currentBookingId) {
        Set<Integer> uniqueTableIds = tableIds.stream().collect(Collectors.toSet());
        if (uniqueTableIds.size() != tableIds.size()) {
            throw new BadRequestException("A table can only appear once in a booking");
        }

        List<resTable> tables = new ArrayList<>();
        for (Integer tableId : tableIds) {
            if (tableId == null) {
                throw new BadRequestException("Table ID is required");
            }

            resTable table = this.tableRepository.findById(tableId)
                    .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableId));

            if (table.getStatus() == resTable.Status.OCCUPIED) {
                throw new BadRequestException("Table is currently occupied: " + tableId);
            }

            boolean isBookedByAnotherBooking = currentBookingId == null
                    ? this.bookingRepository.existsByTables_IdAndStatusIn(tableId, ACTIVE_STATUSES)
                    : this.bookingRepository.existsByTables_IdAndStatusInAndIdNot(tableId, ACTIVE_STATUSES, currentBookingId);

            if (isBookedByAnotherBooking) {
                throw new BadRequestException("Table is already booked: " + tableId);
            }

            if (currentBookingId == null && table.getStatus() == resTable.Status.RESERVED) {
                throw new BadRequestException("Table is currently reserved: " + tableId);
            }

            tables.add(table);
        }

        return tables;
    }

    private void validateCapacity(List<resTable> tables, Integer guestCount) {
        int totalCapacity = tables.stream().mapToInt(resTable::getCapacity).sum();
        if (totalCapacity < guestCount) {
            throw new BadRequestException("Selected tables do not have enough capacity for " + guestCount + " guests");
        }
    }

    private List<resTable> mergeTables(List<resTable> firstTables, List<resTable> secondTables) {
        Map<Integer, resTable> mergedTables = new LinkedHashMap<>();

        if (firstTables != null) {
            for (resTable table : firstTables) {
                mergedTables.put(table.getId(), table);
            }
        }

        if (secondTables != null) {
            for (resTable table : secondTables) {
                mergedTables.put(table.getId(), table);
            }
        }

        return new ArrayList<>(mergedTables.values());
    }

    private void refreshTableStatuses(List<resTable> tables) {
        for (resTable table : tables) {
            if (table.getStatus() == resTable.Status.OCCUPIED) {
                continue;
            }

            boolean hasActiveBooking = this.bookingRepository.existsByTables_IdAndStatusIn(table.getId(), ACTIVE_STATUSES);
            table.setStatus(hasActiveBooking ? resTable.Status.RESERVED : resTable.Status.AVAILABLE);
        }

        this.tableRepository.saveAll(tables);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings(Integer userId) {
        List<Booking> bookings;
        if (userId != null) {
            if (!this.userRepository.existsById(userId)) {
                throw new ResourceNotFoundException("User not found with id: " + userId);
            }
            bookings = this.bookingRepository.findByUserId(userId);
        } else {
            bookings = this.bookingRepository.findAll();
        }

        return bookings.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Integer id) {
        Booking booking = this.bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        User user = resolveUser(request.getUserId());
        List<resTable> tables = resolveTables(request.getTableIds(), null);
        validateCapacity(tables, request.getGuestCount());

        Booking booking = new Booking();
        requestToEntity(booking, request, user, tables);
        Booking savedBooking = this.bookingRepository.save(booking);
        refreshTableStatuses(savedBooking.getTables());

        return toResponse(savedBooking);
    }

    @Transactional
    public BookingResponse updateBooking(Integer id, BookingRequest request) {
        Booking bookingInDb = this.bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        List<resTable> oldTables = bookingInDb.getTables() == null ? List.of() : new ArrayList<>(bookingInDb.getTables());
        User user = resolveUser(request.getUserId());
        List<resTable> newTables = resolveTables(request.getTableIds(), id);
        validateCapacity(newTables, request.getGuestCount());

        requestToEntity(bookingInDb, request, user, newTables);
        Booking savedBooking = this.bookingRepository.save(bookingInDb);
        refreshTableStatuses(mergeTables(oldTables, newTables));

        return toResponse(savedBooking);
    }

    @Transactional
    public void deleteBooking(Integer id) {
        Booking booking = this.bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        List<resTable> oldTables = booking.getTables() == null ? List.of() : new ArrayList<>(booking.getTables());
        this.bookingRepository.delete(booking);
        refreshTableStatuses(oldTables);
    }
}