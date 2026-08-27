package com.rudra.retrievo.controller;

import com.rudra.retrievo.dto.UserProfileUpdateDto;
import com.rudra.retrievo.dto.UserLoginDto;
import com.rudra.retrievo.dto.UserRegistrationDto;
import com.rudra.retrievo.dto.UserResponseDto;
import com.rudra.retrievo.entity.User;
import com.rudra.retrievo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto) {
        User registeredUser = userService.registerNewUser(registrationDto);
        UserResponseDto responseDto = UserResponseDto.fromEntity(registeredUser);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@Valid @RequestBody UserLoginDto loginDto) {
        String token = userService.loginUser(loginDto);
        User user = userService.getUserByEmail(loginDto.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("role", user.getRole() != null ? user.getRole().name() : "USER");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(UserResponseDto.fromEntity(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponseDto> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UserProfileUpdateDto updateDto
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User updatedUser = userService.updateUserProfile(authentication.getName(), updateDto);
        return ResponseEntity.ok(UserResponseDto.fromEntity(updatedUser));
    }
}
