package com.curiolearn.config;

import com.curiolearn.social.StudyRoomWebSocketHandler;
import com.curiolearn.ai.TelehealthWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final StudyRoomWebSocketHandler studyRoomWebSocketHandler;
    private final TelehealthWebSocketHandler telehealthWebSocketHandler;

    public WebSocketConfig(StudyRoomWebSocketHandler studyRoomWebSocketHandler, TelehealthWebSocketHandler telehealthWebSocketHandler) {
        this.studyRoomWebSocketHandler = studyRoomWebSocketHandler;
        this.telehealthWebSocketHandler = telehealthWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(studyRoomWebSocketHandler, "/ws/study-room")
                .setAllowedOrigins("*");
        registry.addHandler(telehealthWebSocketHandler, "/ws/telehealth")
                .setAllowedOrigins("*");
    }
}

