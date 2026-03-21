package com.farmcrop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "crop_records")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CropRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    private Field field;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @Column(name = "planting_date")
    private LocalDate plantingDate;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "yield_kg")
    private Double yieldKg;

    @Column(name = "cost_incurred", precision = 12, scale = 2)
    private BigDecimal costIncurred;

    @Column(name = "revenue_generated", precision = 12, scale = 2)
    private BigDecimal revenueGenerated;

    @Enumerated(EnumType.STRING)
    private CropStatus status;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status approvalStatus = Status.PENDING;

    // Soft delete support
    @Builder.Default
    private boolean isDeleted = false;

    public enum CropStatus { PLANTED, GROWING, HARVESTED, FAILED }
}
