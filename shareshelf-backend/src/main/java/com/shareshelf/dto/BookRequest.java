package com.shareshelf.dto;

import com.shareshelf.entity.BookCondition;
import jakarta.validation.constraints.NotBlank;

public record BookRequest(
        @NotBlank(message = "Title is required") String title,
        @NotBlank(message = "Author is required") String author,
        String genre,
        String description,
        BookCondition condition,
        String coverUrl) {
}
