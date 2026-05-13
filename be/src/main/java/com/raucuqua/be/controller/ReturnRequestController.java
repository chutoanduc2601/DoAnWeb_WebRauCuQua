package com.raucuqua.be.controller;

import com.raucuqua.be.dto.ReturnRequestDTO;
import com.raucuqua.be.entity.ReturnRequest;
import com.raucuqua.be.service.ReturnRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/returns")
@CrossOrigin(origins = "*")
public class ReturnRequestController {

    @Autowired
    private ReturnRequestService returnRequestService;

    @PostMapping
    public ResponseEntity<ReturnRequest> createReturnRequest(@RequestBody ReturnRequestDTO dto) {
        ReturnRequest saved = returnRequestService.createReturnRequest(dto);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReturnRequest>> getReturnRequestsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(returnRequestService.getReturnRequestsByUser(userId));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<ReturnRequest>> getReturnRequestsByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(returnRequestService.getReturnRequestsByOrder(orderId));
    }

    @GetMapping("/paged")
    public Page<ReturnRequest> getReturnRequestsPaged(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        return returnRequestService.getReturnRequestsPaged(search, status, pageable);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ReturnRequest> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        ReturnRequest updated = returnRequestService.updateStatus(id, body.get("status"), body.get("adminNote"));
        return ResponseEntity.ok(updated);
    }
}
