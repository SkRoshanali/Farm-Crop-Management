package com.farmcrop.service;

import com.farmcrop.dto.request.FarmerRequestDTO;
import com.farmcrop.dto.response.FarmerResponseDTO;
import java.util.List;

public interface FarmerService {
    FarmerResponseDTO createFarmer(FarmerRequestDTO dto);
    FarmerResponseDTO getFarmerById(Long id);
    List<FarmerResponseDTO> getAllFarmers();
    FarmerResponseDTO updateFarmer(Long id, FarmerRequestDTO dto);
    void deleteFarmer(Long id);
}
