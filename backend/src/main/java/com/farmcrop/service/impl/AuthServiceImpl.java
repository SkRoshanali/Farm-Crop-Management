package com.farmcrop.service.impl;

import com.farmcrop.dto.request.AuthRequestDTO;
import com.farmcrop.dto.request.RegisterRequestDTO;
import com.farmcrop.dto.response.AuthResponseDTO;
import com.farmcrop.entity.User;
import com.farmcrop.exception.BadRequestException;
import com.farmcrop.repository.UserRepository;
import com.farmcrop.security.JwtService;
import com.farmcrop.service.AuthService;

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Override
    public AuthResponseDTO login(AuthRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword()));
        UserDetails userDetails = userDetailsService.loadUserByUsername(dto.getUsername());
        String token = jwtService.generateToken(userDetails);
        User user = userRepository.findByUsername(dto.getUsername()).orElseThrow();
        return new AuthResponseDTO(token, user.getUsername(), user.getRole().name());
    }

    @Override
    public AuthResponseDTO register(RegisterRequestDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new BadRequestException("Username already taken: " + dto.getUsername());
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already registered: " + dto.getEmail());
        }
        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(User.Role.USER)
                .enabled(true)
                .build();
        User savedUser = userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getUsername());
        String token = jwtService.generateToken(userDetails);
        return new AuthResponseDTO(token, savedUser.getUsername(), savedUser.getRole().name());
    }
}
