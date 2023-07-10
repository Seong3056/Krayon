package com.krayon.backend.socket.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebsocketConfig implements WebSocketConfigurer {
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry){
		registry
				.addHandler(MyWebSocketHandler(),"/chat/*")
				.setAllowedOrigins("*");

	}
	@Bean
	public WebSocketHandler MyWebSocketHandler() {
		return new SocketHandler();
	}
}
