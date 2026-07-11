package com.ngocquang.restautant.modules.table.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ngocquang.restautant.common.helper.ResourceNotFoundException;
import com.ngocquang.restautant.modules.table.dto.TableRequest;
import com.ngocquang.restautant.modules.table.dto.TableResponse;
import com.ngocquang.restautant.modules.table.entity.resTable;
import com.ngocquang.restautant.modules.table.repository.resTableRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RestaurantTableService {

    private final resTableRepository tableRepository;

    private TableResponse toResponse(resTable table) {
        return TableResponse.builder()
                .id(table.getId())
                .name(table.getName())
                .description(table.getDescription())
                .capacity(table.getCapacity())
                .status(table.getStatus())
                .build();
    }

    private void RequestToEntity(resTable table, TableRequest request) {
        table.setName(request.getName());
        table.setDescription(request.getDescription());
        table.setCapacity(request.getCapacity());
        table.setStatus(request.getStatus() != null ? request.getStatus() : resTable.Status.AVAILABLE);
    }

    public List<TableResponse> getAllTable() {
        return this.tableRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TableResponse> getAvailableTables(java.time.LocalDateTime bookingTime, int guests) {
        java.time.LocalDateTime startTime = bookingTime.minusHours(2);
        java.time.LocalDateTime endTime = bookingTime.plusHours(2);
        return this.tableRepository.findAvailableTables(guests, startTime, endTime).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TableResponse getTableById(Integer id) {
        return toResponse(this.tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id)));
    }

    public TableResponse createTable(TableRequest request) {
        resTable table = new resTable();
        RequestToEntity(table, request);
        return toResponse(tableRepository.save(table));
    }

    public TableResponse updateTable(Integer id, TableRequest request) {
        resTable table = this.tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));
        RequestToEntity(table, request);
        return toResponse(tableRepository.save(table));
    }

    public void deleteTableById(Integer id) {
        resTable table = this.tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));
        this.tableRepository.delete(table);
    }
}
