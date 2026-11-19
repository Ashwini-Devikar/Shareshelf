package com.shareshelf.dto;

import com.shareshelf.entity.Book;
import java.time.LocalDateTime;

// Field names match the mock data used by the React frontend (owner, city, condition...)
public record BookResponse(
        Long id,
        String title,
        String author,
        String genre,
        String description,
        String condition,
        String coverUrl,
        String status,
        Long ownerId,
        String owner,
        String city,
        LocalDateTime createdAt) {

    public static BookResponse from(Book b) {
        return new BookResponse(
                b.getId(),
                b.getTitle(),
                b.getAuthor(),
                b.getGenre(),
                b.getDescription(),
                b.getCondition().name(),
                b.getCoverUrl(),
                b.getStatus().name(),
                b.getOwner().getId(),
                b.getOwner().getName(),
                b.getOwner().getCity(),
                b.getCreatedAt());
    }
}
