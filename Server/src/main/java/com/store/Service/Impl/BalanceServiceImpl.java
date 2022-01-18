package com.store.Service.Impl;

import com.store.Domain.BalanceRequest;
import com.store.Repository.BalanceRepository;
import com.store.Service.BalanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BalanceServiceImpl implements BalanceService {

    @Autowired
    private BalanceRepository balanceRepository;

    @Override
    public List<BalanceRequest> findAll() {
        return (List<BalanceRequest>) balanceRepository.findAll();
    }

    @Override
    public Optional<BalanceRequest> findById(Long id) {
        return balanceRepository.findById(id);
    }

    @Override
    public BalanceRequest save(BalanceRequest balanceRequest) {
        return balanceRepository.save(balanceRequest);
    }

    @Override
    public void addBalance(BalanceRequest balanceRequest) {
        balanceRepository.save(balanceRequest);
    }
}
