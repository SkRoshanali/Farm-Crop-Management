package com.farmcrop.dto.request;

import com.farmcrop.entity.CropRecord.CropStatus;
import com.farmcrop.validation.ValidDateRange;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@ValidDateRange
public class CropRecordRequestDTO {

    @NotNull(message = "Field ID is required")
    private Long fieldId;

    @NotNull(message = "Crop ID is required")
    private Long cropId;

    @NotNull(message = "Planting date is required")
    @PastOrPresent(message = "Planting date cannot be in the future")
    private LocalDate plantingDate;

    @PastOrPresent(message = "Harvest date cannot be in the future")
    private LocalDate harvestDate;
    
    @PositiveOrZero(message = "Yield must be zero or positive")
    private Double yieldKg;
    
    @PositiveOrZero(message = "Cost must be zero or positive")
    private BigDecimal costIncurred;
    
    @PositiveOrZero(message = "Revenue must be zero or positive")
    private BigDecimal revenueGenerated;
    
    private CropStatus status;
}
