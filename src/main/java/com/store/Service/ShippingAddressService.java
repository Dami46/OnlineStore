package com.store.Service;

import com.store.Domain.ShippingAddress;
import com.store.Domain.UserShipping;

public interface ShippingAddressService {
    ShippingAddress setByUserShipping(UserShipping userShipping, ShippingAddress shippingAddress);
}
