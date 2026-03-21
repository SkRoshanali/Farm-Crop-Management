package com.farmcrop.dto.response;

import lombok.Data;

@Data
public class FieldResponseDTO {
    private Long id;
    private String name;
    private Double areaInAcres;
    private String location;
    private String soilType;
    private Long farmerId;
    private String farmerName;
}
