package com.farmcrop.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CropRequestDTO {

    @NotBlank(message = "Crop name is required")
    @Size(min = 2, max = 100)
    private String name;

    private String variety;
    private String season;
    private String description;

    @Positive(message = "Growth duration must be positive")
    private Integer growthDurationDays;
}
