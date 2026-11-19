package com.shareshelf.repository;

import com.shareshelf.entity.BorrowRequest;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {

    // Requests I sent
    List<BorrowRequest> findByBorrowerIdOrderByRequestedAtDesc(Long borrowerId);

    // Requests other people sent for my books
    List<BorrowRequest> findByBookOwnerIdOrderByRequestedAtDesc(Long ownerId);
}
