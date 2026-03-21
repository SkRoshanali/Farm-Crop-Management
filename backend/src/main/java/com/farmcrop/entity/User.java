package com.farmcrop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Scope fields for RBAC
    private String state;
    private String district;
    private String mandal;

    @Builder.Default
    private boolean enabled = true;

    public enum Role { 
        STATE_OFFICER, 
        DISTRICT_OFFICER, 
        DATA_ENTRY_OPERATOR, 
        AUDITOR,
        // Legacy role mappings for backward compatibility
        ADMIN, 
        USER 
    }
}
