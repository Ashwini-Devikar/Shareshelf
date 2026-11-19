package com.shareshelf.controller;

import com.shareshelf.dto.BookRequest;
import com.shareshelf.dto.BookResponse;
import com.shareshelf.service.BookService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // Public: GET /api/books?q=java&genre=Technology&available=true
    @GetMapping
    public List<BookResponse> list(@RequestParam(required = false) String q,
                                   @RequestParam(required = false) String genre,
                                   @RequestParam(defaultValue = "false") boolean available) {
        return bookService.search(q, genre, available);
    }

    @GetMapping("/{id}")
    public BookResponse get(@PathVariable Long id) {
        return bookService.get(id);
    }

    @GetMapping("/my")
    public List<BookResponse> myBooks(Authentication auth) {
        return bookService.myBooks(auth.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponse create(@Valid @RequestBody BookRequest req, Authentication auth) {
        return bookService.create(auth.getName(), req);
    }

    @PutMapping("/{id}")
    public BookResponse update(@PathVariable Long id,
                               @Valid @RequestBody BookRequest req,
                               Authentication auth) {
        return bookService.update(auth.getName(), id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication auth) {
        bookService.delete(auth.getName(), id);
    }
}
