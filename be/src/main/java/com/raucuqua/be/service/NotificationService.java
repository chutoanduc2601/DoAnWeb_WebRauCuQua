package com.raucuqua.be.service;

import com.raucuqua.be.entity.Order;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class NotificationService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        
        // Gửi một event ban đầu để giữ kết nối
        try {
            emitter.send(SseEmitter.event().name("connect").data("Connected"));
        } catch (IOException e) {
            emitter.completeWithError(e);
            return emitter;
        }

        this.emitters.add(emitter);

        emitter.onCompletion(() -> this.emitters.remove(emitter));
        emitter.onTimeout(() -> this.emitters.remove(emitter));
        emitter.onError((e) -> this.emitters.remove(emitter));

        return emitter;
    }

    public void broadcast(Order order) {
        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();
        
        this.emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                        .name("newOrder")
                        .data(order));
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        });

        this.emitters.removeAll(deadEmitters);
    }
}
