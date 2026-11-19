package com.shareshelf.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User owner;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 150)
    private String author;

    @Column(length = 80)
    private String genre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "book_condition", nullable = false, length = 20)
    private BookCondition condition = BookCondition.GOOD;

    @Column(name = "cover_url")
    private String coverUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookStatus status = BookStatus.AVAILABLE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BookCondition getCondition() { return condition; }
    public void setCondition(BookCondition condition) { this.condition = condition; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

    public BookStatus getStatus() { return status; }
    public void setStatus(BookStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
