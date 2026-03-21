package com.farmcrop.util;

import com.farmcrop.entity.User.Role;
import com.farmcrop.entity.Permission;
import java.util.Set;
import static com.farmcrop.entity.Permission.*;

public class RolePermissions {

    public static Set<Permission> getPermissions(Role role) {
        return switch (role) {
            case STATE_OFFICER -> Set.of(CREATE, READ, UPDATE, DELETE);
            case DISTRICT_OFFICER -> Set.of(CREATE, READ, UPDATE, DELETE);
            case DATA_ENTRY_OPERATOR -> Set.of(CREATE, READ, UPDATE);
            case AUDITOR -> Set.of(READ);
            case ADMIN -> Set.of(CREATE, READ, UPDATE, DELETE);
            case USER -> Set.of(READ);
        };
    }
}