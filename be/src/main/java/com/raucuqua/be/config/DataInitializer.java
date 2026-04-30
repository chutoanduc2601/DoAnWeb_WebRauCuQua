package com.raucuqua.be.config;

import com.raucuqua.be.entity.Category;
import com.raucuqua.be.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initCategories(CategoryRepository categoryRepository) {
        return args -> {
            if (categoryRepository.count() == 0) {
                List<Category> categories = Arrays.asList(
                    new Category(null, "Rau xanh", "rau-xanh", "leaf", "Các loại rau lá tươi sạch", null),
                    new Category(null, "Củ quả", "cu-qua", "carrot", "Các loại củ, quả giàu dinh dưỡng", null),
                    new Category(null, "Trái cây", "trai-cay", "apple", "Trái cây tươi ngon mỗi ngày", null),
                    new Category(null, "Nấm & Mầm", "nam-mam", "mushroom", "Nấm và rau mầm các loại", null),
                    new Category(null, "Gia vị", "gia-vi", "pepper", "Hành, tỏi, ớt và các loại gia vị", null)
                );
                categoryRepository.saveAll(categories);
                System.out.println(">> Đã khởi tạo dữ liệu mẫu cho Category");
            }
        };
    }
}
