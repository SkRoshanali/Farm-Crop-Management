package com.farmcrop.controller;

import com.farmcrop.dto.request.CropRequestDTO;
import com.farmcrop.dto.response.ApiResponse;
import com.farmcrop.dto.response.CropResponseDTO;
import com.farmcrop.service.CropService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
@RequiredArgsConstructor
public class CropController {

    private final CropService cropService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','ADMIN')")
    public ResponseEntity<ApiResponse<CropResponseDTO>> createCrop(@Valid @RequestBody CropRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Crop created", cropService.createCrop(dto)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','AUDITOR','ADMIN','USER')")
    public ResponseEntity<ApiResponse<CropResponseDTO>> getCropById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Success", cropService.getCropById(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','AUDITOR','ADMIN','USER')")
    public ResponseEntity<ApiResponse<List<CropResponseDTO>>> getAllCrops() {
        return ResponseEntity.ok(ApiResponse.success("Success", cropService.getAllCrops()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','ADMIN')")
    public ResponseEntity<ApiResponse<CropResponseDTO>> updateCrop(
            @PathVariable Long id, @Valid @RequestBody CropRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Crop updated", cropService.updateCrop(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCrop(@PathVariable Long id) {
        cropService.deleteCrop(id);
        return ResponseEntity.ok(ApiResponse.success("Crop deleted", null));
    }
}
