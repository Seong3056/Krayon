package com.krayon.backend.socket;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@Component
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry){
        registry.setSendBufferSizeLimit(160*1024);
        registry.setMessageSizeLimit(160*1024);
    }
    @Override
    public  void registerStompEndpoints(StompEndpointRegistry registry){
        registry.addEndpoint("/chatt");
    }
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
}