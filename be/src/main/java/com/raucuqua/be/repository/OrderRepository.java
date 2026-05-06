package com.raucuqua.be.repository;

import com.raucuqua.be.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);

    @Query("SELECT o FROM Order o WHERE " +
           "(:search IS NULL OR LOWER(o.orderCode) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) OR LOWER(o.fullName) LIKE LOWER(CONCAT('%', cast(:search as string), '%'))) AND " +
           "(:status IS NULL OR o.status = :status)")
    Page<Order> findByFiltersPaged(
            @Param("search") String search,
            @Param("status") String status,
            Pageable pageable);
}
