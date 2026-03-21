package com.farmcrop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "crops")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String variety;
    private String season;
    private String description;

    @Column(name = "growth_duration_days")
    private Integer growthDurationDays;

    @Builder.Default
    private boolean isDeleted = false;
}
