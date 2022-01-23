package com.store.Repository;

import com.store.Domain.BillingAddress;
import com.store.Domain.Order;
import org.springframework.data.repository.CrudRepository;

public interface BillingAddressRepository extends CrudRepository<BillingAddress, Long> {

    void deleteAllByOrder(Order order);
}
