package com.curiolearn.config;

import com.curiolearn.social.StudyRoomWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final StudyRoomWebSocketHandler studyRoomWebSocketHandler;

    public WebSocketConfig(StudyRoomWebSocketHandler studyRoomWebSocketHandler) {
        this.studyRoomWebSocketHandler = studyRoomWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(studyRoomWebSocketHandler, "/ws/study-room")
                .setAllowedOrigins("*");
    }
}
