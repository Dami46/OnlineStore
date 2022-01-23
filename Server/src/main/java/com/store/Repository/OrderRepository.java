package com.store.Repository;

import com.store.Domain.Order;
import com.store.Domain.User;
import org.springframework.data.repository.CrudRepository;

public interface OrderRepository extends CrudRepository<Order, Long> {

    void deleteAllByUser(User user);

}
