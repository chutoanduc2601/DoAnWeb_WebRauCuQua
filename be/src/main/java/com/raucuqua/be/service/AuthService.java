package com.raucuqua.be.service;

import com.raucuqua.be.dto.AuthResponse;
import com.raucuqua.be.dto.RegisterRequest;
import com.raucuqua.be.entity.User;
import com.raucuqua.be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .message("Đăng ký thành công!")
                .user(savedUser)
                .build();
    }

    public AuthResponse login(com.raucuqua.be.dto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Sai email hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai email hoặc mật khẩu");
        }

        return AuthResponse.builder()
                .message("Đăng nhập thành công!")
                .user(user)
                .build();
    }
}
