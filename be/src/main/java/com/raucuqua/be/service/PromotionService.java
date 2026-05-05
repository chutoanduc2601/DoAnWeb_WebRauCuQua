package com.raucuqua.be.service;

import com.raucuqua.be.entity.Promotion;
import com.raucuqua.be.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    public Optional<Promotion> getPromotionById(Long id) {
        return promotionRepository.findById(id);
    }

    public Promotion createPromotion(Promotion promotion) {
        if (promotionRepository.findByCode(promotion.getCode()).isPresent()) {
            throw new RuntimeException("Mã khuyến mãi '" + promotion.getCode() + "' đã tồn tại.");
        }
        return promotionRepository.save(promotion);
    }

    public Promotion updatePromotion(Long id, Promotion promotionDetails) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        
        promotion.setCode(promotionDetails.getCode());
        promotion.setName(promotionDetails.getName());
        promotion.setDescription(promotionDetails.getDescription());
        promotion.setType(promotionDetails.getType());
        promotion.setValue(promotionDetails.getValue());
        promotion.setMinOrderAmount(promotionDetails.getMinOrderAmount());
        promotion.setStartDate(promotionDetails.getStartDate());
        promotion.setEndDate(promotionDetails.getEndDate());
        promotion.setMaxUsage(promotionDetails.getMaxUsage());
        promotion.setStatus(promotionDetails.getStatus());
        
        return promotionRepository.save(promotion);
    }

    public void deletePromotion(Long id) {
        promotionRepository.deleteById(id);
    }

    public Promotion validatePromotion(String code, Double orderAmount) {
        Promotion promotion = promotionRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại."));

        if (!"ACTIVE".equals(promotion.getStatus())) {
            throw new RuntimeException("Mã giảm giá không còn hiệu lực.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (promotion.getStartDate() != null && now.isBefore(promotion.getStartDate())) {
            throw new RuntimeException("Chương trình khuyến mãi chưa bắt đầu.");
        }
        if (promotion.getEndDate() != null && now.isAfter(promotion.getEndDate())) {
            throw new RuntimeException("Mã giảm giá đã hết hạn.");
        }

        if (promotion.getMaxUsage() != null && promotion.getUsageCount() >= promotion.getMaxUsage()) {
            throw new RuntimeException("Mã giảm giá đã hết lượt sử dụng.");
        }

        if (orderAmount < promotion.getMinOrderAmount()) {
            throw new RuntimeException("Đơn hàng chưa đủ giá trị tối thiểu để áp dụng mã này.");
        }

        return promotion;
    }

    public void incrementUsage(String code) {
        promotionRepository.findByCode(code).ifPresent(promotion -> {
            promotion.setUsageCount(promotion.getUsageCount() + 1);
            promotionRepository.save(promotion);
        });
    }
}
