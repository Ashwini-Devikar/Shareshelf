package com.shareshelf.service;

import com.shareshelf.dto.BookRequest;
import com.shareshelf.dto.BookResponse;
import com.shareshelf.entity.Book;
import com.shareshelf.entity.BookCondition;
import com.shareshelf.entity.Role;
import com.shareshelf.entity.User;
import com.shareshelf.exception.ApiException;
import com.shareshelf.repository.BookRepository;
import com.shareshelf.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookService {

    private final BookRepository books;
    private final UserRepository users;

    public BookService(BookRepository books, UserRepository users) {
        this.books = books;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public List<BookResponse> search(String q, String genre, boolean availableOnly) {
        String query = q == null ? "" : q.trim();
        String g = genre == null ? "" : genre.trim();
        return books.search(query, g, availableOnly).stream().map(BookResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public BookResponse get(Long id) {
        return BookResponse.from(find(id));
    }

    @Transactional(readOnly = true)
    public List<BookResponse> myBooks(String email) {
        User me = currentUser(email);
        return books.findByOwnerIdOrderByCreatedAtDesc(me.getId()).stream().map(BookResponse::from).toList();
    }

    @Transactional
    public BookResponse create(String email, BookRequest req) {
        Book book = new Book();
        book.setOwner(currentUser(email));
        apply(book, req);
        return BookResponse.from(books.save(book));
    }

    @Transactional
    public BookResponse update(String email, Long id, BookRequest req) {
        Book book = find(id);
        User me = currentUser(email);

        if (!book.getOwner().getId().equals(me.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only edit your own books");
        }
        apply(book, req);
        return BookResponse.from(books.save(book));
    }

    @Transactional
    public void delete(String email, Long id) {
        Book book = find(id);
        User me = currentUser(email);

        boolean isOwner = book.getOwner().getId().equals(me.getId());
        if (!isOwner && me.getRole() != Role.ADMIN) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only delete your own books");
        }
        if (book.getStatus() != com.shareshelf.entity.BookStatus.AVAILABLE) {
            throw new ApiException(HttpStatus.CONFLICT, "This book is currently requested or borrowed and cannot be deleted");
        }
        books.delete(book);
    }

    // ---- helpers ----

    private Book find(Long id) {
        return books.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found"));
    }

    private User currentUser(String email) {
        return users.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private void apply(Book book, BookRequest req) {
        book.setTitle(req.title().trim());
        book.setAuthor(req.author().trim());
        book.setGenre(req.genre());
        book.setDescription(req.description());
        book.setCoverUrl(req.coverUrl());
        book.setCondition(req.condition() != null ? req.condition() : BookCondition.GOOD);
    }
}
