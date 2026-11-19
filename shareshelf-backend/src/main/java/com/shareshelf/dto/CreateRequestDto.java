package com.shareshelf.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRequestDto(
        @NotNull(message = "bookId is required") Long bookId,
        @Size(max = 300, message = "Message can be at most 300 characters") String message) {
}
