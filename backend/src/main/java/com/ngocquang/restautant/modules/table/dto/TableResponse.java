package com.ngocquang.restautant.modules.table.dto;

import com.ngocquang.restautant.modules.table.entity.resTable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableResponse {
    private Integer id;
    private String name;
    private String description;
    private Integer capacity;
    private resTable.Status status;
}
