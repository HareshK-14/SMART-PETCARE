package com.petcare.backend.controller;

import com.petcare.backend.model.Product;
import com.petcare.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/marketplace")
public class MarketplaceController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts(@RequestParam(required = false) String category) {
        if(category != null && !category.isEmpty()) {
            List<Product> products = productRepository.findByCategory(category);
            return ResponseEntity.ok(products);
        }
        
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }

    @PostMapping("/admin/add-product")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
         // Secure endpoint mapped only to admins. Assumes security firewall allows it.
         Product saved = productRepository.save(product);
         return ResponseEntity.ok(saved);
    }
}
