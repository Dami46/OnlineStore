package com.store.Service.Impl;

import com.store.Domain.UserShipping;
import com.store.Repository.UserShippingRepository;
import com.store.Service.UserShippingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserShippingServiceImpl implements UserShippingService {

    @Autowired
    private UserShippingRepository userShippingRepository;

    @Override
    public UserShipping findById(Long id) {
        return userShippingRepository.findById(id).orElse(null);
    }

    @Override
    public void removeById(Long id) {
        userShippingRepository.deleteById(id);
    }
}
