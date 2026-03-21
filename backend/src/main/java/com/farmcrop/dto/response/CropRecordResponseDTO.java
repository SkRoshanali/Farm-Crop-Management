package com.farmcrop.dto.response;

import com.farmcrop.entity.CropRecord.CropStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CropRecordResponseDTO {
    private Long id;
    private Long fieldId;
    private String fieldName;
    private Long cropId;
    private String cropName;
    private LocalDate plantingDate;
    private LocalDate harvestDate;
    private Double yieldKg;
    private BigDecimal costIncurred;
    private BigDecimal revenueGenerated;
    private BigDecimal profit;
    private CropStatus status;
    private String approvalStatus;
}
