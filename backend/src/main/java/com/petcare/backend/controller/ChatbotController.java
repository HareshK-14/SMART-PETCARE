package com.petcare.backend.controller;

import com.petcare.backend.dto.request.ChatRequest;
import com.petcare.backend.dto.response.MessageResponse;
import com.petcare.backend.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/chat")
    public ResponseEntity<?> sendChatMessage(@RequestBody ChatRequest request) {
        if(request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Message cannot be empty."));
        }

        String aiResponse = chatbotService.getAiResponse(request.getMessage());
        return ResponseEntity.ok(new MessageResponse(aiResponse));
    }
}
