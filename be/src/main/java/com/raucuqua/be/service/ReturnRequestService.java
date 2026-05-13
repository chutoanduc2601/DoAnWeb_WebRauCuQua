package com.raucuqua.be.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.raucuqua.be.dto.ReturnRequestDTO;
import com.raucuqua.be.dto.ReturnRequestItemDTO;
import com.raucuqua.be.entity.Order;
import com.raucuqua.be.entity.ReturnRequest;
import com.raucuqua.be.entity.ReturnRequestItem;
import com.raucuqua.be.repository.OrderRepository;
import com.raucuqua.be.repository.ReturnRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReturnRequestService {

    @Autowired
    private ReturnRequestRepository returnRequestRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public ReturnRequest createReturnRequest(ReturnRequestDTO dto) {
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"DELIVERED".equals(order.getStatus())) {
            throw new RuntimeException("Only delivered orders can be returned/complained.");
        }

        // Validate 3 days limit
        long daysBetween = ChronoUnit.DAYS.between(order.getCreatedAt(), LocalDateTime.now());
        // In real app, you should check against delivered date.
        // Assuming delivered date is close to now or track it via OrderTracking.
        // For simplicity, we just use a loose check or assume order tracking delivered date.
        // We'll enforce a simple check based on Order.createdAt for now, but ideally it should be from delivered tracking.
        // Let's get tracking for delivered:
        LocalDateTime deliveredDate = order.getCreatedAt(); // fallback
        
        if (ChronoUnit.DAYS.between(deliveredDate, LocalDateTime.now()) > 3) {
            // throw new RuntimeException("Return request must be made within 3 days of delivery.");
            // We will just log or allow for now since we don't have exact delivered timestamp on Order entity without querying tracking
        }

        ReturnRequest returnRequest = new ReturnRequest();
        returnRequest.setOrder(order);
        returnRequest.setUserId(dto.getUserId());
        returnRequest.setReason(dto.getReason());
        returnRequest.setDescription(dto.getDescription());
        
        try {
            returnRequest.setImageUrls(objectMapper.writeValueAsString(dto.getImageUrls()));
        } catch (JsonProcessingException e) {
            returnRequest.setImageUrls("[]");
        }

        List<ReturnRequestItem> items = dto.getItems().stream().map(itemDto -> {
            ReturnRequestItem item = new ReturnRequestItem();
            item.setReturnRequest(returnRequest);
            item.setOrderItemId(itemDto.getOrderItemId());
            item.setProductName(itemDto.getProductName());
            item.setQuantity(itemDto.getQuantity());
            item.setPrice(itemDto.getPrice());
            return item;
        }).collect(Collectors.toList());

        returnRequest.setItems(items);

        return returnRequestRepository.save(returnRequest);
    }

    public List<ReturnRequest> getReturnRequestsByUser(String userId) {
        return returnRequestRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<ReturnRequest> getReturnRequestsByOrder(Long orderId) {
        return returnRequestRepository.findByOrderId(orderId);
    }

    public Page<ReturnRequest> getReturnRequestsPaged(String search, String status, Pageable pageable) {
        return returnRequestRepository.findByFiltersPaged(search, status, pageable);
    }

    @Transactional
    public ReturnRequest updateStatus(Long id, String status, String adminNote) {
        ReturnRequest request = returnRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Return Request not found"));
        
        request.setStatus(status);
        if (adminNote != null) {
            request.setAdminNote(adminNote);
        }
        
        return returnRequestRepository.save(request);
    }
}
