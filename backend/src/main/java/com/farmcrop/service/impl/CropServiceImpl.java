package com.farmcrop.service.impl;

import com.farmcrop.dto.request.CropRequestDTO;
import com.farmcrop.dto.response.CropResponseDTO;
import com.farmcrop.entity.Crop;
import com.farmcrop.exception.BadRequestException;
import com.farmcrop.exception.ResourceNotFoundException;
import com.farmcrop.repository.CropRepository;
import com.farmcrop.service.CropService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CropServiceImpl implements CropService {

    private static final Logger log = LoggerFactory.getLogger(CropServiceImpl.class);
    private final CropRepository cropRepository;
    private final ModelMapper modelMapper;

    @Override
    public CropResponseDTO createCrop(CropRequestDTO dto) {
        if (cropRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Crop already exists: " + dto.getName());
        }
        Crop crop = modelMapper.map(dto, Crop.class);
        return modelMapper.map(cropRepository.save(crop), CropResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public CropResponseDTO getCropById(Long id) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crop", id));
        return modelMapper.map(crop, CropResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CropResponseDTO> getAllCrops() {
        return cropRepository.findAll().stream()
                .map(c -> modelMapper.map(c, CropResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public CropResponseDTO updateCrop(Long id, CropRequestDTO dto) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crop", id));
        
        // Manual mapping to avoid ModelMapper issues with existing objects
        crop.setName(dto.getName());
        crop.setVariety(dto.getVariety());
        crop.setSeason(dto.getSeason());
        crop.setDescription(dto.getDescription());
        crop.setGrowthDurationDays(dto.getGrowthDurationDays());
        
        return modelMapper.map(cropRepository.save(crop), CropResponseDTO.class);
    }

    @Override
    public void deleteCrop(Long id) {
        if (!cropRepository.existsById(id)) throw new ResourceNotFoundException("Crop", id);
        cropRepository.deleteById(id);
    }
}
