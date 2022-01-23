package com.store.Service.Impl;

import com.store.Domain.User;
import com.store.Domain.UserShipping;
import com.store.Repository.UserShippingRepository;
import com.store.Service.UserShippingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Override
    @Transactional
    public void removeByUser(User user) {
        userShippingRepository.deleteAllByUser(user);
    }
}
