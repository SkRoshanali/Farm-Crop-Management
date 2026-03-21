package com.farmcrop.dto.response;

import lombok.Data;

@Data
public class CropResponseDTO {
    private Long id;
    private String name;
    private String variety;
    private String season;
    private String description;
    private Integer growthDurationDays;
}
