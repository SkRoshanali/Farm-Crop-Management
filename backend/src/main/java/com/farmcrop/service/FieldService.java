package com.farmcrop.service;

import com.farmcrop.dto.request.FieldRequestDTO;
import com.farmcrop.dto.response.FieldResponseDTO;
import java.util.List;

public interface FieldService {
    FieldResponseDTO createField(FieldRequestDTO dto);
    FieldResponseDTO getFieldById(Long id);
    List<FieldResponseDTO> getAllFields();
    List<FieldResponseDTO> getFieldsByFarmerId(Long farmerId);
    FieldResponseDTO updateField(Long id, FieldRequestDTO dto);
    void deleteField(Long id);
}
