package com.farmcrop.controller;

import com.farmcrop.dto.request.AuthRequestDTO;
import com.farmcrop.dto.request.RegisterRequestDTO;
import com.farmcrop.dto.response.ApiResponse;
import com.farmcrop.dto.response.AuthResponseDTO;
import com.farmcrop.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@Valid @RequestBody AuthRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Login successful", authService.login(dto)));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> register(@Valid @RequestBody RegisterRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Registered successfully", authService.register(dto)));
    }
}
