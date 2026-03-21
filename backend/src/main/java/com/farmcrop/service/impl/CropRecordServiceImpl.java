package com.farmcrop.service.impl;

import com.farmcrop.dto.request.CropRecordRequestDTO;
import com.farmcrop.dto.response.CropRecordResponseDTO;
import com.farmcrop.entity.Crop;
import com.farmcrop.entity.CropRecord;
import com.farmcrop.entity.Field;
import com.farmcrop.exception.ResourceNotFoundException;
import com.farmcrop.repository.CropRecordRepository;
import com.farmcrop.repository.CropRepository;
import com.farmcrop.repository.FieldRepository;
import com.farmcrop.service.CropRecordService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CropRecordServiceImpl implements CropRecordService {

    private final CropRecordRepository cropRecordRepository;
    private final FieldRepository fieldRepository;
    private final CropRepository cropRepository;
    private final ModelMapper modelMapper;

    @Override
    public CropRecordResponseDTO createCropRecord(CropRecordRequestDTO dto) {
        Field field = fieldRepository.findById(dto.getFieldId())
                .orElseThrow(() -> new ResourceNotFoundException("Field", dto.getFieldId()));
        Crop crop = cropRepository.findById(dto.getCropId())
                .orElseThrow(() -> new ResourceNotFoundException("Crop", dto.getCropId()));
        CropRecord record = modelMapper.map(dto, CropRecord.class);
        record.setField(field);
        record.setCrop(crop);
        return toDTO(cropRecordRepository.save(record));
    }

    @Override
    @Transactional(readOnly = true)
    public CropRecordResponseDTO getCropRecordById(Long id) {
        return toDTO(cropRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CropRecord", id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CropRecordResponseDTO> getAllCropRecords() {
        return cropRecordRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CropRecordResponseDTO> getCropRecordsByFieldId(Long fieldId) {
        return cropRecordRepository.findByFieldId(fieldId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CropRecordResponseDTO> getCropRecordsByFarmerId(Long farmerId) {
        return cropRecordRepository.findAllByFarmerId(farmerId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public CropRecordResponseDTO updateCropRecord(Long id, CropRecordRequestDTO dto) {
        CropRecord record = cropRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CropRecord", id));
        record.setPlantingDate(dto.getPlantingDate());
        record.setHarvestDate(dto.getHarvestDate());
        record.setYieldKg(dto.getYieldKg());
        record.setCostIncurred(dto.getCostIncurred());
        record.setRevenueGenerated(dto.getRevenueGenerated());
        record.setStatus(dto.getStatus());
        return toDTO(cropRecordRepository.save(record));
    }

    @Override
    public void deleteCropRecord(Long id) {
        CropRecord record = cropRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CropRecord", id));
        record.setDeleted(true);
        cropRecordRepository.save(record);
    }

    private CropRecordResponseDTO toDTO(CropRecord record) {
        CropRecordResponseDTO dto = modelMapper.map(record, CropRecordResponseDTO.class);
        dto.setFieldId(record.getField().getId());
        dto.setFieldName(record.getField().getName());
        dto.setCropId(record.getCrop().getId());
        dto.setCropName(record.getCrop().getName());
        if (record.getRevenueGenerated() != null && record.getCostIncurred() != null) {
            dto.setProfit(record.getRevenueGenerated().subtract(record.getCostIncurred()));
        }
        return dto;
    }
}
