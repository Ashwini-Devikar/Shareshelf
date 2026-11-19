package com.shareshelf.dto;

import java.time.LocalDate;

/** dueDate is optional. If it is missing, the due date is 14 days from today. */
public record ApproveRequestDto(LocalDate dueDate) {
}
