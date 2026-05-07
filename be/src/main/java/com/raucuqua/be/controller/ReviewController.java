package com.raucuqua.be.controller;

import com.raucuqua.be.dto.ReviewDTO;
import com.raucuqua.be.entity.Product;
import com.raucuqua.be.entity.Review;
import com.raucuqua.be.repository.ProductRepository;
import com.raucuqua.be.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    // Lấy danh sách review theo sản phẩm
    @GetMapping("/product/{productId}")
    public List<Review> getReviewsByProduct(@PathVariable Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    // Lấy tổng quan rating (trung bình + số lượng)
    @GetMapping("/product/{productId}/summary")
    public Map<String, Object> getReviewSummary(@PathVariable Long productId) {
        Map<String, Object> summary = new HashMap<>();
        Double avg = reviewRepository.findAverageRatingByProductId(productId);
        Long count = reviewRepository.countByProductId(productId);
        summary.put("averageRating", avg != null ? Math.round(avg * 10.0) / 10.0 : 0);
        summary.put("totalReviews", count);
        return summary;
    }

    // Kiểm tra user đã review chưa
    @GetMapping("/product/{productId}/check")
    public Map<String, Boolean> checkUserReview(
            @PathVariable Long productId,
            @RequestParam String userId) {
        boolean exists = reviewRepository.existsByProductIdAndUserId(productId, userId);
        Map<String, Boolean> result = new HashMap<>();
        result.put("hasReviewed", exists);
        return result;
    }

    // Tạo review mới
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewDTO dto) {
        // Validate rating
        if (dto.getRating() == null || dto.getRating() < 1 || dto.getRating() > 5) {
            return ResponseEntity.badRequest().body("Rating phải từ 1 đến 5");
        }

        // Kiểm tra đã review chưa
        if (reviewRepository.existsByProductIdAndUserId(dto.getProductId(), dto.getUserId())) {
            return ResponseEntity.badRequest().body("Bạn đã đánh giá sản phẩm này rồi");
        }

        // Tìm product
        Optional<Product> productOpt = productRepository.findById(dto.getProductId());
        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Review review = new Review();
        review.setProduct(productOpt.get());
        review.setUserId(dto.getUserId());
        review.setUserName(dto.getUserName());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        return ResponseEntity.ok(reviewRepository.save(review));
    }

    // Xoá review
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id, @RequestParam String userId) {
        Optional<Review> reviewOpt = reviewRepository.findById(id);
        if (reviewOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Review review = reviewOpt.get();
        if (!review.getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        reviewRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
