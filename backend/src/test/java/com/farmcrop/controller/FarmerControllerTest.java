package com.farmcrop.controller;

import com.farmcrop.dto.request.FarmerRequestDTO;
import com.farmcrop.dto.response.FarmerResponseDTO;
import com.farmcrop.security.CustomUserDetailsService;
import com.farmcrop.security.JwtAuthFilter;
import com.farmcrop.security.JwtService;
import com.farmcrop.service.FarmerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = FarmerController.class)
@AutoConfigureMockMvc(addFilters = false)
class FarmerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FarmerService farmerService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    private FarmerResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        responseDTO = new FarmerResponseDTO();
        responseDTO.setId(1L);
        responseDTO.setName("John Farmer");
        responseDTO.setEmail("john@farm.com");
        responseDTO.setPhone("9876543210");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/farmers - should create farmer")
    void createFarmer_Returns201() throws Exception {

        FarmerRequestDTO req = new FarmerRequestDTO();
        req.setName("John Farmer");
        req.setEmail("john@farm.com");
        req.setPhone("9876543210");

        when(farmerService.createFarmer(any(FarmerRequestDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(post("/api/farmers")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("John Farmer"));
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("GET /api/farmers - should return list")
    void getAllFarmers_Returns200() throws Exception {

        when(farmerService.getAllFarmers()).thenReturn(List.of(responseDTO));

        mockMvc.perform(get("/api/farmers")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].name").value("John Farmer"));
    }
}