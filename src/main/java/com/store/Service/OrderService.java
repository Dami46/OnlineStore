package com.store.Service;

import com.store.Domain.*;

public interface OrderService {

    Order createOrder(ShoppingCart shoppingCart, ShippingAddress shippingAddress, BillingAddress billingAddress, String shippingMethod, User user);

    Order findOne(Long id);
}
