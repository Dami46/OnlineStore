package com.store.Repository;

import com.store.Domain.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User,Long> {

    User findByUsername(String username);

    User findByEmail(String email);
}
