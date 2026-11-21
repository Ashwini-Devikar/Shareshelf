package com.shareshelf.controller;

import com.shareshelf.dto.UserSummary;
import com.shareshelf.entity.Book;
import com.shareshelf.entity.BookStatus;
import com.shareshelf.entity.BorrowRequest;
import com.shareshelf.entity.RequestStatus;
import com.shareshelf.entity.Role;
import com.shareshelf.entity.User;
import com.shareshelf.exception.ApiException;
import com.shareshelf.repository.BookRepository;
import com.shareshelf.repository.BorrowRequestRepository;
import com.shareshelf.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository users;
    private final BookRepository books;
    private final BorrowRequestRepository requests;

    public AdminController(UserRepository users, BookRepository books, BorrowRequestRepository requests) {
        this.users = users;
        this.books = books;
        this.requests = requests;
    }

    @GetMapping("/users")
    @Transactional(readOnly = true)
    public List<UserSummary> listUsers() {
        return users.findAll().stream().map(UserSummary::from).toList();
    }

    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteUser(@PathVariable Long id, Authentication auth) {
        User target = users.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (target.getEmail().equals(auth.getName())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot delete your own account");
        }
        if (target.getRole() == Role.ADMIN) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Admin accounts cannot be deleted here");
        }

        // Other people's books that this user was requesting/borrowing become available again
        for (BorrowRequest r : requests.findByBorrowerId(id)) {
            boolean open = r.getStatus() == RequestStatus.PENDING || r.getStatus() == RequestStatus.APPROVED;
            Book book = r.getBook();
            if (open && !book.getOwner().getId().equals(id)) {
                book.setStatus(BookStatus.AVAILABLE);
                books.save(book);
            }
        }

        // Foreign keys: requests first, then books, then the user
        requests.deleteByBookOwnerId(id);
        requests.deleteByBorrowerId(id);
        books.deleteAll(books.findByOwnerIdOrderByCreatedAtDesc(id));
        users.delete(target);
    }
}
