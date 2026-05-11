package com.petcare.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatbotService {

    @Value("${openrouter.api.key:YOUR_OPENROUTER_KEY_HERE}")
    private String openRouterApiKey;

    private static final String OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

    @SuppressWarnings("unchecked")
    public String getAiResponse(String userMessage) {
        
        // Return a mock response if no key is supplied to prevent application crashes during unconfigured testing
        if(openRouterApiKey.equals("YOUR_OPENROUTER_KEY_HERE")) {
            return "This is a fallback mock response because the OpenRouter API Key has not been configured in application.properties.";
        }

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openRouterApiKey);
        headers.set("HTTP-Referer", "http://localhost:5173"); 
        headers.set("X-Title", "Smart Pet Care Platform");

        Map<String, Object> requestBody = new HashMap<>();
        // Specify a solid fast instruction model
        requestBody.put("model", "google/gemini-2.5-flash"); 

        List<Map<String, String>> messages = new ArrayList<>();
        
        // System Prompt giving the AI its persona
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "You are the 'Smart Pet Care Assistant', an expert veterinary AI. Provide helpful, accurate advice regarding pet health, diet, and training. Keep your answers concise. Always add a disclaimer that in medical emergencies users must consult a real Veterinarian.");
        messages.add(systemMessage);

        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", userMessage);
        messages.add(userMsg);

        requestBody.put("messages", messages);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(OPENROUTER_API_URL, entity, Map.class);
            
            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
            return "Sorry, I couldn't process that right now.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error communicating with AI service: " + e.getMessage();
        }
    }
}
