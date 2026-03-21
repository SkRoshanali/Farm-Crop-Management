package com.farmcrop.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FarmerResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private LocalDateTime createdAt;
    private String status;
}
