package com.raucuqua.be.repository;

import com.raucuqua.be.entity.OrderTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderTrackingRepository extends JpaRepository<OrderTracking, Long> {
    List<OrderTracking> findByOrder_IdOrderByCreatedAtDesc(Long orderId);
    
    @org.springframework.data.jpa.repository.Query("SELECT t FROM OrderTracking t WHERE t.order.id = :orderId ORDER BY t.createdAt DESC")
    List<OrderTracking> findByOrderId(Long orderId);
}
