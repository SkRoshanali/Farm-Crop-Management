package com.farmcrop.controller;

import com.farmcrop.dto.request.FarmerRequestDTO;
import com.farmcrop.dto.response.ApiResponse;
import com.farmcrop.dto.response.FarmerResponseDTO;
import com.farmcrop.service.FarmerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmers")
@RequiredArgsConstructor
public class FarmerController {

    private final FarmerService farmerService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','ADMIN')")
    public ResponseEntity<ApiResponse<FarmerResponseDTO>> createFarmer(
            @Valid @RequestBody FarmerRequestDTO dto) {
        FarmerResponseDTO response = farmerService.createFarmer(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Farmer created successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','AUDITOR','ADMIN','USER')")
    public ResponseEntity<ApiResponse<FarmerResponseDTO>> getFarmerById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Success", farmerService.getFarmerById(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','AUDITOR','ADMIN','USER')")
    public ResponseEntity<ApiResponse<List<FarmerResponseDTO>>> getAllFarmers() {
        return ResponseEntity.ok(ApiResponse.success("Success", farmerService.getAllFarmers()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','ADMIN')")
    public ResponseEntity<ApiResponse<FarmerResponseDTO>> updateFarmer(
            @PathVariable Long id, @Valid @RequestBody FarmerRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Farmer updated", farmerService.updateFarmer(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFarmer(@PathVariable Long id) {
        farmerService.deleteFarmer(id);
        return ResponseEntity.ok(ApiResponse.success("Farmer deleted", null));
    }
}
