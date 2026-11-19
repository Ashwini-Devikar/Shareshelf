package com.shareshelf.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "borrow_requests")
public class BorrowRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "book_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Book book;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "borrower_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User borrower;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(length = 300)
    private String message;

    @Column(name = "requested_at", nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "returned_at")
    private LocalDateTime returnedAt;

    @PrePersist
    void onCreate() {
        this.requestedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    public User getBorrower() { return borrower; }
    public void setBorrower(User borrower) { this.borrower = borrower; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getRequestedAt() { return requestedAt; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getReturnedAt() { return returnedAt; }
    public void setReturnedAt(LocalDateTime returnedAt) { this.returnedAt = returnedAt; }
}
