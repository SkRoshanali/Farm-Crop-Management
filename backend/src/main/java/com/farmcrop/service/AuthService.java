package com.farmcrop.service;

import com.farmcrop.dto.request.AuthRequestDTO;
import com.farmcrop.dto.request.RegisterRequestDTO;
import com.farmcrop.dto.response.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO login(AuthRequestDTO dto);
    AuthResponseDTO register(RegisterRequestDTO dto);
}
