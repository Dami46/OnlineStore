package com.store.Service;

import com.store.Domain.BalanceRequest;

import java.util.List;
import java.util.Optional;

public interface BalanceService {

    List<BalanceRequest> findAll();

    Optional<BalanceRequest> findById(Long id);

    BalanceRequest save(BalanceRequest book);

    void addBalance(BalanceRequest balanceRequest);
}
