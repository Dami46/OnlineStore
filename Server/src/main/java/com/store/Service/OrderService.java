package com.store.Service;

import com.store.Domain.*;

public interface OrderService {

    void saveShippingAddress(ShippingAddress shippingAddress);

    void saveBillingAddress(BillingAddress billingAddress);

    Order createOrder(ShoppingCart shoppingCart, ShippingAddress shippingAddress, BillingAddress billingAddress, String shippingMethod, User user);

    Order createOrder(Book book,ShippingAddress shippingAddress, BillingAddress billingAddress, String shippingMethod, User user);

    Order findOne(Long id);

    void deleteAllByUser(User user);
}
