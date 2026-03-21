package com.farmcrop.controller;

import com.farmcrop.dto.request.CropRecordRequestDTO;
import com.farmcrop.dto.response.ApiResponse;
import com.farmcrop.dto.response.CropRecordResponseDTO;
import com.farmcrop.service.CropRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crop-records")
@RequiredArgsConstructor
public class CropRecordController {

    private final CropRecordService cropRecordService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','ADMIN')")
    public ResponseEntity<ApiResponse<CropRecordResponseDTO>> create(@Valid @RequestBody CropRecordRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Record created", cropRecordService.createCropRecord(dto)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','AUDITOR','ADMIN','USER')")
    public ResponseEntity<ApiResponse<CropRecordResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Success", cropRecordService.getCropRecordById(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','AUDITOR','ADMIN','USER')")
    public ResponseEntity<ApiResponse<List<CropRecordResponseDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Success", cropRecordService.getAllCropRecords()));
    }

    @GetMapping("/field/{fieldId}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','AUDITOR','ADMIN','USER')")
    public ResponseEntity<ApiResponse<List<CropRecordResponseDTO>>> getByField(@PathVariable Long fieldId) {
        return ResponseEntity.ok(ApiResponse.success("Success", cropRecordService.getCropRecordsByFieldId(fieldId)));
    }

    @GetMapping("/farmer/{farmerId}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','AUDITOR','ADMIN','USER')")
    public ResponseEntity<ApiResponse<List<CropRecordResponseDTO>>> getByFarmer(@PathVariable Long farmerId) {
        return ResponseEntity.ok(ApiResponse.success("Success", cropRecordService.getCropRecordsByFarmerId(farmerId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','ADMIN')")
    public ResponseEntity<ApiResponse<CropRecordResponseDTO>> update(
            @PathVariable Long id, @Valid @RequestBody CropRecordRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Record updated", cropRecordService.updateCropRecord(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        cropRecordService.deleteCropRecord(id);
        return ResponseEntity.ok(ApiResponse.success("Record deleted", null));
    }
}
