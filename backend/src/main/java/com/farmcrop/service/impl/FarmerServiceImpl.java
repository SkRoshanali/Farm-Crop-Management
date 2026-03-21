package com.farmcrop.service.impl;

import com.farmcrop.dto.request.FarmerRequestDTO;
import com.farmcrop.dto.response.FarmerResponseDTO;
import com.farmcrop.entity.Farmer;
import com.farmcrop.exception.BadRequestException;
import com.farmcrop.exception.ResourceNotFoundException;
import com.farmcrop.repository.FarmerRepository;
import com.farmcrop.service.FarmerService;
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
public class FarmerServiceImpl implements FarmerService {

    private static final Logger log = LoggerFactory.getLogger(FarmerServiceImpl.class);

    private final FarmerRepository farmerRepository;
    private final ModelMapper modelMapper;

    @Override
    public FarmerResponseDTO createFarmer(FarmerRequestDTO dto) {
        log.info("Creating farmer with email: {}", dto.getEmail());
        if (farmerRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Farmer already exists with email: " + dto.getEmail());
        }
        Farmer farmer = modelMapper.map(dto, Farmer.class);
        Farmer saved = farmerRepository.save(farmer);
        log.info("Farmer created with id: {}", saved.getId());
        return modelMapper.map(saved, FarmerResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public FarmerResponseDTO getFarmerById(Long id) {
        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer", id));
        return modelMapper.map(farmer, FarmerResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FarmerResponseDTO> getAllFarmers() {
        return farmerRepository.findAll()
                .stream()
                .map(f -> modelMapper.map(f, FarmerResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public FarmerResponseDTO updateFarmer(Long id, FarmerRequestDTO dto) {
        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer", id));
        
        // Check if email is being changed and if it's already taken
        if (!farmer.getEmail().equals(dto.getEmail()) && farmerRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already in use: " + dto.getEmail());
        }
        
        farmer.setName(dto.getName());
        farmer.setEmail(dto.getEmail());
        farmer.setPhone(dto.getPhone());
        farmer.setAddress(dto.getAddress());
        return modelMapper.map(farmerRepository.save(farmer), FarmerResponseDTO.class);
    }

    @Override
    public void deleteFarmer(Long id) {
        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer", id));
        farmer.setDeleted(true);
        farmerRepository.save(farmer);
        log.info("Farmer soft-deleted with id: {}", id);
    }
}
