package com.rudra.retrievo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping("/live")
    public ResponseEntity<String> liveness() {
        return ResponseEntity.ok("ALIVE");
    }

}
