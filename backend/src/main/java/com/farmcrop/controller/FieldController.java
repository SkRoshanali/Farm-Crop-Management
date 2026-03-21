package com.farmcrop.controller;

import com.farmcrop.dto.request.FieldRequestDTO;
import com.farmcrop.dto.response.ApiResponse;
import com.farmcrop.dto.response.FieldResponseDTO;
import com.farmcrop.service.FieldService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fields")
@RequiredArgsConstructor
public class FieldController {

    private final FieldService fieldService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','ADMIN')")
    public ResponseEntity<ApiResponse<FieldResponseDTO>> createField(@Valid @RequestBody FieldRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Field created", fieldService.createField(dto)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','AUDITOR','ADMIN','USER')")
    public ResponseEntity<ApiResponse<FieldResponseDTO>> getFieldById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Success", fieldService.getFieldById(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','AUDITOR','ADMIN','USER')")
    public ResponseEntity<ApiResponse<List<FieldResponseDTO>>> getAllFields() {
        return ResponseEntity.ok(ApiResponse.success("Success", fieldService.getAllFields()));
    }

    @GetMapping("/farmer/{farmerId}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','AUDITOR','ADMIN','USER')")
    public ResponseEntity<ApiResponse<List<FieldResponseDTO>>> getFieldsByFarmer(@PathVariable Long farmerId) {
        return ResponseEntity.ok(ApiResponse.success("Success", fieldService.getFieldsByFarmerId(farmerId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','DATA_ENTRY_OPERATOR','ADMIN')")
    public ResponseEntity<ApiResponse<FieldResponseDTO>> updateField(
            @PathVariable Long id, @Valid @RequestBody FieldRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Field updated", fieldService.updateField(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STATE_OFFICER','DISTRICT_OFFICER','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteField(@PathVariable Long id) {
        fieldService.deleteField(id);
        return ResponseEntity.ok(ApiResponse.success("Field deleted", null));
    }
}
