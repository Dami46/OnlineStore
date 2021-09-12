package com.store.Service;

import com.store.Domain.ShoppingCart;

public interface ShoppingCartService {

    ShoppingCart updateShoppingCart(ShoppingCart shoppingCart);

     void clearShoppingCart (ShoppingCart shoppingCart);
}
