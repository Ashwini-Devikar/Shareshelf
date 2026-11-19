package com.shareshelf.repository;

import com.shareshelf.entity.Book;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    // q and genre are passed as "" when not used (never null)
    @Query("""
            SELECT b FROM Book b
            WHERE (LOWER(b.title) LIKE LOWER(CONCAT('%', :q, '%'))
                   OR LOWER(b.author) LIKE LOWER(CONCAT('%', :q, '%')))
              AND (:genre = '' OR b.genre = :genre)
              AND (:availableOnly = false OR b.status = com.shareshelf.entity.BookStatus.AVAILABLE)
            ORDER BY b.createdAt DESC
            """)
    List<Book> search(@Param("q") String q,
                      @Param("genre") String genre,
                      @Param("availableOnly") boolean availableOnly);
}
