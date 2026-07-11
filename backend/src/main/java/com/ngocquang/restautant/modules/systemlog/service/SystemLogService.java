package com.ngocquang.restautant.modules.systemlog.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ngocquang.restautant.common.helper.ResourceNotFoundException;
import com.ngocquang.restautant.modules.systemlog.dto.SystemLogDTO;
import com.ngocquang.restautant.modules.systemlog.entity.SystemAction;
import com.ngocquang.restautant.modules.systemlog.entity.SystemLog;
import com.ngocquang.restautant.modules.systemlog.repository.SystemLogRepository;
import com.ngocquang.restautant.modules.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SystemLogService {

    private final SystemLogRepository systemLogRepository;

    private SystemLogDTO toResponse(SystemLog log) {
        return SystemLogDTO.builder()
                .id(log.getId())
                .action(log.getAction() != null ? log.getAction().name() : null)
                .detail(log.getDetail())
                .loggedAt(log.getLoggedAt())
                .userId(log.getUser() != null ? log.getUser().getId() : null)
                .userEmail(log.getUser() != null ? log.getUser().getEmail() : "System")
                .build();
    }

    public Page<SystemLogDTO> getAllLogs(
            String action,
            String keyword,
            String from,
            String to,
            Pageable pageable
    ) {
        SystemAction actionEnum = parseAction(action);

        keyword = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;

        LocalDateTime fromDate = null;
        LocalDateTime toDate = null;

        try {
            fromDate = LocalDate.parse(from).atStartOfDay();
        } catch (Exception e) {
        }

        try {
            toDate = LocalDate.parse(to).atTime(23, 59, 59);
        } catch (Exception e) {
        }

        return systemLogRepository.search(actionEnum, keyword, fromDate, toDate, pageable)
                .map(this::toResponse);
    }

    private SystemAction parseAction(String action) {
        if (action == null || action.isBlank()) return null;
        try {
            return SystemAction.valueOf(action.trim().toUpperCase());
        } catch (Exception e) {
            return null;
        }
    }

    public SystemLogDTO getById(Integer id) {

        SystemLog log = systemLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("System log not found with id: " + id));

        return toResponse(log);
    }

    public void log(SystemAction action, String detail, User user) {

        SystemLog systemLog = SystemLog.builder()
                .action(action != null ? action : SystemAction.OTHER)
                .detail(detail)
                .user(user)
                .build();

        systemLogRepository.save(systemLog);
    }
}