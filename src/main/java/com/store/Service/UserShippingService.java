package com.store.Service;

import com.store.Domain.UserShipping;

public interface UserShippingService {

    UserShipping findById(Long id);

    void removeById(Long id);
}
