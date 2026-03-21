package com.farmcrop.service.impl;

import com.farmcrop.dto.request.FieldRequestDTO;
import com.farmcrop.dto.response.FieldResponseDTO;
import com.farmcrop.entity.Farmer;
import com.farmcrop.entity.Field;
import com.farmcrop.exception.ResourceNotFoundException;
import com.farmcrop.repository.FarmerRepository;
import com.farmcrop.repository.FieldRepository;
import com.farmcrop.service.FieldService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FieldServiceImpl implements FieldService {

    private final FieldRepository fieldRepository;
    private final FarmerRepository farmerRepository;
    private final ModelMapper modelMapper;

    @Override
    public FieldResponseDTO createField(FieldRequestDTO dto) {
        Farmer farmer = farmerRepository.findById(dto.getFarmerId())
                .orElseThrow(() -> new ResourceNotFoundException("Farmer", dto.getFarmerId()));
        Field field = modelMapper.map(dto, Field.class);
        field.setFarmer(farmer);
        Field saved = fieldRepository.save(field);
        return toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FieldResponseDTO getFieldById(Long id) {
        return toDTO(fieldRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Field", id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FieldResponseDTO> getAllFields() {
        return fieldRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FieldResponseDTO> getFieldsByFarmerId(Long farmerId) {
        return fieldRepository.findByFarmerId(farmerId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public FieldResponseDTO updateField(Long id, FieldRequestDTO dto) {
        Field field = fieldRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Field", id));
        field.setName(dto.getName());
        field.setAreaInAcres(dto.getAreaInAcres());
        field.setLocation(dto.getLocation());
        field.setSoilType(dto.getSoilType());
        return toDTO(fieldRepository.save(field));
    }

    @Override
    public void deleteField(Long id) {
        if (!fieldRepository.existsById(id)) throw new ResourceNotFoundException("Field", id);
        fieldRepository.deleteById(id);
    }

    private FieldResponseDTO toDTO(Field field) {
        FieldResponseDTO dto = modelMapper.map(field, FieldResponseDTO.class);
        dto.setFarmerId(field.getFarmer().getId());
        dto.setFarmerName(field.getFarmer().getName());
        return dto;
    }
}
