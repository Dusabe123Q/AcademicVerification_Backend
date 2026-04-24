package com.dusabe.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This allows the frontend to access uploaded files (like certificates)
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}