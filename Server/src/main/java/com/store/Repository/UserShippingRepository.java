package com.store.Repository;

import com.store.Domain.User;
import com.store.Domain.UserShipping;
import org.springframework.data.repository.CrudRepository;

public interface UserShippingRepository extends CrudRepository<UserShipping, Long> {

    void deleteAllByUser(User user);
}
