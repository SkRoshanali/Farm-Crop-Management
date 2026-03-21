package com.farmcrop.service;

import com.farmcrop.dto.request.CropRequestDTO;
import com.farmcrop.dto.response.CropResponseDTO;
import com.farmcrop.entity.Crop;
import com.farmcrop.exception.BadRequestException;
import com.farmcrop.repository.CropRepository;
import com.farmcrop.service.impl.CropServiceImpl;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CropServiceTest {

    @Mock private CropRepository cropRepository;
    @Mock private ModelMapper modelMapper;
    @InjectMocks private CropServiceImpl cropService;

    @Test
    @DisplayName("Should create crop successfully")
    void createCrop_Success() {
        CropRequestDTO dto = new CropRequestDTO();
        dto.setName("Wheat");
        Crop crop = Crop.builder().id(1L).name("Wheat").build();
        CropResponseDTO responseDTO = new CropResponseDTO();
        responseDTO.setId(1L);
        responseDTO.setName("Wheat");

        when(cropRepository.existsByName("Wheat")).thenReturn(false);
        when(modelMapper.map(dto, Crop.class)).thenReturn(crop);
        when(cropRepository.save(crop)).thenReturn(crop);
        when(modelMapper.map(crop, CropResponseDTO.class)).thenReturn(responseDTO);

        CropResponseDTO result = cropService.createCrop(dto);
        assertThat(result.getName()).isEqualTo("Wheat");
    }

    @Test
    @DisplayName("Should throw when crop name already exists")
    void createCrop_Duplicate_Throws() {
        CropRequestDTO dto = new CropRequestDTO();
        dto.setName("Rice");
        when(cropRepository.existsByName("Rice")).thenReturn(true);
        assertThatThrownBy(() -> cropService.createCrop(dto))
                .isInstanceOf(BadRequestException.class);
    }
}
