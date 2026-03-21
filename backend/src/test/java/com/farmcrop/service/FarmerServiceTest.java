package com.farmcrop.service;

import com.farmcrop.dto.request.FarmerRequestDTO;
import com.farmcrop.dto.response.FarmerResponseDTO;
import com.farmcrop.entity.Farmer;
import com.farmcrop.exception.BadRequestException;
import com.farmcrop.exception.ResourceNotFoundException;
import com.farmcrop.repository.FarmerRepository;
import com.farmcrop.service.impl.FarmerServiceImpl;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FarmerServiceTest {

    @Mock private FarmerRepository farmerRepository;
    @Mock private ModelMapper modelMapper;
    @InjectMocks private FarmerServiceImpl farmerService;

    private Farmer farmer;
    private FarmerRequestDTO requestDTO;
    private FarmerResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        farmer = Farmer.builder().id(1L).name("John").email("john@farm.com").build();
        requestDTO = new FarmerRequestDTO();
        requestDTO.setName("John");
        requestDTO.setEmail("john@farm.com");
        responseDTO = new FarmerResponseDTO();
        responseDTO.setId(1L);
        responseDTO.setName("John");
        responseDTO.setEmail("john@farm.com");
    }

    @Test
    @DisplayName("Should create farmer successfully")
    void createFarmer_Success() {
        when(farmerRepository.existsByEmail(anyString())).thenReturn(false);
        when(modelMapper.map(requestDTO, Farmer.class)).thenReturn(farmer);
        when(farmerRepository.save(farmer)).thenReturn(farmer);
        when(modelMapper.map(farmer, FarmerResponseDTO.class)).thenReturn(responseDTO);

        FarmerResponseDTO result = farmerService.createFarmer(requestDTO);

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("john@farm.com");
        verify(farmerRepository).save(any(Farmer.class));
    }

    @Test
    @DisplayName("Should throw exception when email already exists")
    void createFarmer_EmailExists_ThrowsBadRequest() {
        when(farmerRepository.existsByEmail("john@farm.com")).thenReturn(true);

        assertThatThrownBy(() -> farmerService.createFarmer(requestDTO))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("john@farm.com");
    }

    @Test
    @DisplayName("Should return farmer by id")
    void getFarmerById_Found() {
        when(farmerRepository.findById(1L)).thenReturn(Optional.of(farmer));
        when(modelMapper.map(farmer, FarmerResponseDTO.class)).thenReturn(responseDTO);

        FarmerResponseDTO result = farmerService.getFarmerById(1L);
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when farmer not found")
    void getFarmerById_NotFound() {
        when(farmerRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> farmerService.getFarmerById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Should delete farmer successfully")
    void deleteFarmer_Success() {
        when(farmerRepository.existsById(1L)).thenReturn(true);
        farmerService.deleteFarmer(1L);
        verify(farmerRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Should return all farmers")
    void getAllFarmers_ReturnsList() {
        when(farmerRepository.findAll()).thenReturn(List.of(farmer));
        when(modelMapper.map(farmer, FarmerResponseDTO.class)).thenReturn(responseDTO);
        List<FarmerResponseDTO> result = farmerService.getAllFarmers();
        assertThat(result).hasSize(1);
    }
}
