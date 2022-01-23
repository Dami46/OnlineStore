package com.store.Repository;

import com.store.Domain.Order;
import com.store.Domain.ShippingAddress;
import org.springframework.data.repository.CrudRepository;

public interface ShippingAddressRepository extends CrudRepository<ShippingAddress, Long> {

    void deleteAllByOrder(Order order);
}
