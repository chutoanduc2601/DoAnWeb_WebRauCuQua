package com.raucuqua.be.repository;

import com.raucuqua.be.entity.ReturnRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {
    
    List<ReturnRequest> findByOrderId(Long orderId);
    
    List<ReturnRequest> findByUserIdOrderByCreatedAtDesc(String userId);

    @Query(value = "SELECT rr.* FROM return_requests rr JOIN orders o ON o.id = rr.order_id WHERE " +
           "(:status IS NULL OR rr.status = :status) AND " +
           "(:search IS NULL OR LOWER(CAST(o.order_code AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(CAST(o.full_name AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY rr.created_at DESC",
           countQuery = "SELECT COUNT(*) FROM return_requests rr JOIN orders o ON o.id = rr.order_id WHERE " +
           "(:status IS NULL OR rr.status = :status) AND " +
           "(:search IS NULL OR LOWER(CAST(o.order_code AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(CAST(o.full_name AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')))",
           nativeQuery = true)
    Page<ReturnRequest> findByFiltersPaged(@Param("search") String search,
                                           @Param("status") String status,
                                           Pageable pageable);
}
