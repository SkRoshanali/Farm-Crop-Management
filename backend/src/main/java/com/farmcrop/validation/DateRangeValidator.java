package com.farmcrop.validation;

import com.farmcrop.dto.request.CropRecordRequestDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class DateRangeValidator implements ConstraintValidator<ValidDateRange, CropRecordRequestDTO> {

    @Override
    public boolean isValid(CropRecordRequestDTO dto, ConstraintValidatorContext context) {
        if (dto == null) {
            return true;
        }
        
        if (dto.getPlantingDate() == null) {
            return true; // Let @NotNull handle this
        }
        
        if (dto.getHarvestDate() == null) {
            return true; // Harvest date is optional
        }
        
        return dto.getHarvestDate().isAfter(dto.getPlantingDate()) || 
               dto.getHarvestDate().isEqual(dto.getPlantingDate());
    }
}
