package com.farmcrop.service;

import com.farmcrop.dto.request.CropRequestDTO;
import com.farmcrop.dto.response.CropResponseDTO;
import java.util.List;

public interface CropService {
    CropResponseDTO createCrop(CropRequestDTO dto);
    CropResponseDTO getCropById(Long id);
    List<CropResponseDTO> getAllCrops();
    CropResponseDTO updateCrop(Long id, CropRequestDTO dto);
    void deleteCrop(Long id);
}
