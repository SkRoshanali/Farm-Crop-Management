package com.farmcrop.service;

import com.farmcrop.dto.request.CropRecordRequestDTO;
import com.farmcrop.dto.response.CropRecordResponseDTO;
import java.util.List;

public interface CropRecordService {
    CropRecordResponseDTO createCropRecord(CropRecordRequestDTO dto);
    CropRecordResponseDTO getCropRecordById(Long id);
    List<CropRecordResponseDTO> getAllCropRecords();
    List<CropRecordResponseDTO> getCropRecordsByFieldId(Long fieldId);
    List<CropRecordResponseDTO> getCropRecordsByFarmerId(Long farmerId);
    CropRecordResponseDTO updateCropRecord(Long id, CropRecordRequestDTO dto);
    void deleteCropRecord(Long id);
}
