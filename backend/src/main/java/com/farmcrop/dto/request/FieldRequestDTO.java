package com.farmcrop.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FieldRequestDTO {

    @NotBlank(message = "Field name is required")
    private String name;

    @NotNull(message = "Area is required")
    @Positive(message = "Area must be positive")
    private Double areaInAcres;

    private String location;
    private String soilType;

    @NotNull(message = "Farmer ID is required")
    private Long farmerId;
}
