package com.store.Repository;

import com.store.Domain.BalanceRequest;
import org.springframework.data.repository.CrudRepository;

public interface BalanceRepository  extends CrudRepository<BalanceRequest, Long> {
}
