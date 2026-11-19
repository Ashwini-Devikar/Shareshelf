package com.shareshelf.dto;

import com.shareshelf.entity.BorrowRequest;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Field names match the mock data in the React frontend (bookTitle, owner, borrower...)
public record BorrowRequestResponse(
        Long id,
        Long bookId,
        String bookTitle,
        Long ownerId,
        String owner,
        Long borrowerId,
        String borrower,
        String message,
        String status,
        LocalDateTime requestedAt,
        LocalDateTime approvedAt,
        LocalDate dueDate,
        LocalDateTime returnedAt) {

    public static BorrowRequestResponse from(BorrowRequest r) {
        return new BorrowRequestResponse(
                r.getId(),
                r.getBook().getId(),
                r.getBook().getTitle(),
                r.getBook().getOwner().getId(),
                r.getBook().getOwner().getName(),
                r.getBorrower().getId(),
                r.getBorrower().getName(),
                r.getMessage(),
                r.getStatus().name(),
                r.getRequestedAt(),
                r.getApprovedAt(),
                r.getDueDate(),
                r.getReturnedAt());
    }
}
