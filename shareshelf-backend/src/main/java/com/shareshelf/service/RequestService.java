package com.shareshelf.service;

import com.shareshelf.dto.ApproveRequestDto;
import com.shareshelf.dto.BorrowRequestResponse;
import com.shareshelf.dto.CreateRequestDto;
import com.shareshelf.entity.Book;
import com.shareshelf.entity.BookStatus;
import com.shareshelf.entity.BorrowRequest;
import com.shareshelf.entity.RequestStatus;
import com.shareshelf.entity.User;
import com.shareshelf.exception.ApiException;
import com.shareshelf.repository.BookRepository;
import com.shareshelf.repository.BorrowRequestRepository;
import com.shareshelf.repository.UserRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Borrow workflow:
 * request  -> request PENDING,  book REQUESTED
 * approve  -> request APPROVED, book BORROWED   (owner)
 * reject   -> request REJECTED, book AVAILABLE  (owner)
 * return   -> request RETURNED, book AVAILABLE  (owner)
 * cancel   -> request CANCELLED, book AVAILABLE (borrower, only while PENDING)
 */
@Service
public class RequestService {

    private static final int DEFAULT_LOAN_DAYS = 14;

    private final BorrowRequestRepository requests;
    private final BookRepository books;
    private final UserRepository users;

    public RequestService(BorrowRequestRepository requests, BookRepository books, UserRepository users) {
        this.requests = requests;
        this.books = books;
        this.users = users;
    }

    @Transactional
    public BorrowRequestResponse create(String email, CreateRequestDto dto) {
        User me = currentUser(email);
        Book book = books.findById(dto.bookId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found"));

        if (book.getOwner().getId().equals(me.getId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot borrow your own book");
        }
        if (book.getStatus() != BookStatus.AVAILABLE) {
            throw new ApiException(HttpStatus.CONFLICT, "This book is not available right now");
        }

        BorrowRequest req = new BorrowRequest();
        req.setBook(book);
        req.setBorrower(me);
        req.setMessage(dto.message());
        req.setStatus(RequestStatus.PENDING);

        book.setStatus(BookStatus.REQUESTED);
        books.save(book);

        return BorrowRequestResponse.from(requests.save(req));
    }

    @Transactional(readOnly = true)
    public List<BorrowRequestResponse> sent(String email) {
        User me = currentUser(email);
        return requests.findByBorrowerIdOrderByRequestedAtDesc(me.getId())
                .stream().map(BorrowRequestResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<BorrowRequestResponse> received(String email) {
        User me = currentUser(email);
        return requests.findByBookOwnerIdOrderByRequestedAtDesc(me.getId())
                .stream().map(BorrowRequestResponse::from).toList();
    }

    @Transactional
    public BorrowRequestResponse approve(String email, Long id, ApproveRequestDto dto) {
        BorrowRequest req = find(id);
        requireOwner(req, currentUser(email));
        requireStatus(req, RequestStatus.PENDING, "Only pending requests can be approved");

        LocalDate due = (dto != null && dto.dueDate() != null)
                ? dto.dueDate()
                : LocalDate.now().plusDays(DEFAULT_LOAN_DAYS);
        if (!due.isAfter(LocalDate.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Due date must be in the future");
        }

        req.setStatus(RequestStatus.APPROVED);
        req.setApprovedAt(LocalDateTime.now());
        req.setDueDate(due);
        setBookStatus(req, BookStatus.BORROWED);

        return BorrowRequestResponse.from(requests.save(req));
    }

    @Transactional
    public BorrowRequestResponse reject(String email, Long id) {
        BorrowRequest req = find(id);
        requireOwner(req, currentUser(email));
        requireStatus(req, RequestStatus.PENDING, "Only pending requests can be rejected");

        req.setStatus(RequestStatus.REJECTED);
        setBookStatus(req, BookStatus.AVAILABLE);

        return BorrowRequestResponse.from(requests.save(req));
    }

    @Transactional
    public BorrowRequestResponse markReturned(String email, Long id) {
        BorrowRequest req = find(id);
        requireOwner(req, currentUser(email));
        requireStatus(req, RequestStatus.APPROVED, "Only approved (borrowed) requests can be marked returned");

        req.setStatus(RequestStatus.RETURNED);
        req.setReturnedAt(LocalDateTime.now());
        setBookStatus(req, BookStatus.AVAILABLE);

        return BorrowRequestResponse.from(requests.save(req));
    }

    @Transactional
    public BorrowRequestResponse cancel(String email, Long id) {
        BorrowRequest req = find(id);
        User me = currentUser(email);

        if (!req.getBorrower().getId().equals(me.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only cancel your own requests");
        }
        requireStatus(req, RequestStatus.PENDING, "Only pending requests can be cancelled");

        req.setStatus(RequestStatus.CANCELLED);
        setBookStatus(req, BookStatus.AVAILABLE);

        return BorrowRequestResponse.from(requests.save(req));
    }

    // ---- helpers ----

    private BorrowRequest find(Long id) {
        return requests.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Request not found"));
    }

    private User currentUser(String email) {
        return users.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private void requireOwner(BorrowRequest req, User me) {
        if (!req.getBook().getOwner().getId().equals(me.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the book owner can do this");
        }
    }

    private void requireStatus(BorrowRequest req, RequestStatus expected, String message) {
        if (req.getStatus() != expected) {
            throw new ApiException(HttpStatus.CONFLICT, message);
        }
    }

    private void setBookStatus(BorrowRequest req, BookStatus status) {
        Book book = req.getBook();
        book.setStatus(status);
        books.save(book);
    }
}
