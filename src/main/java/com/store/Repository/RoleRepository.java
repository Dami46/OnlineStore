package com.store.Repository;

import com.store.Security.Role;
import org.springframework.data.repository.CrudRepository;

public interface RoleRepository extends CrudRepository<Role,Long> {

    Role findByname(String name);
}
