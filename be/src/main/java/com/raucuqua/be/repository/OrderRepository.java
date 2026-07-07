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
    java.util.Optional<Order> findByOrderCode(String orderCode);
    java.util.Optional<Order> findByVnpTxnRef(String vnpTxnRef);

    @Query("SELECT o FROM Order o WHERE " +
           "(:search IS NULL OR LOWER(o.orderCode) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) OR LOWER(o.fullName) LIKE LOWER(CONCAT('%', cast(:search as string), '%'))) AND " +
           "(:status IS NULL OR o.status = :status)")
    Page<Order> findByFiltersPaged(
            @Param("search") String search,
            @Param("status") String status,
            Pageable pageable);

    @Query("SELECT SUM(o.total) FROM Order o WHERE o.status = :status")
    Double sumTotalByStatus(@Param("status") String status);

    @Query("SELECT SUM(o.total) FROM Order o")
    Double sumTotalAll();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(@Param("status") String status);

    @Query(value = "SELECT CAST(created_at AS DATE) as date, SUM(total) as revenue " +
                   "FROM orders " +
                   "WHERE status = 'DELIVERED' " +
                   "GROUP BY CAST(created_at AS DATE) " +
                   "ORDER BY date DESC LIMIT 7", nativeQuery = true)
    List<Object[]> getRevenueLast7Days();

    @Query(value = "SELECT date_trunc('week', created_at) as week_start, SUM(total) as revenue " +
                   "FROM orders " +
                   "WHERE status = 'DELIVERED' " +
                   "GROUP BY date_trunc('week', created_at) " +
                   "ORDER BY week_start DESC LIMIT 10", nativeQuery = true)
    List<Object[]> getRevenueLast10Weeks();

    @Query(value = "SELECT EXTRACT(MONTH FROM created_at) as month, SUM(total) as revenue " +
                   "FROM orders " +
                   "WHERE status = 'DELIVERED' AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE) " +
                   "GROUP BY EXTRACT(MONTH FROM created_at) " +
                   "ORDER BY month ASC", nativeQuery = true)
    List<Object[]> getRevenueCurrentYearByMonth();

    @Query(value = "SELECT EXTRACT(YEAR FROM created_at) as year, SUM(total) as revenue " +
                   "FROM orders " +
                   "WHERE status = 'DELIVERED' " +
                   "GROUP BY EXTRACT(YEAR FROM created_at) " +
                   "ORDER BY year ASC", nativeQuery = true)
    List<Object[]> getRevenueByYear();
}
