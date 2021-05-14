package com.store.Service;

import com.store.Domain.Book;
import com.store.Domain.CartItem;
import com.store.Domain.ShoppingCart;
import com.store.Domain.User;

import java.util.List;

public interface CartItemService {

    List<CartItem> findByShoppingCart(ShoppingCart shoppingCart);

    CartItem updateCartItem(CartItem cartItem);

    CartItem addBookToCartItem(Book book, User user, int quantity);

    CartItem findById(Long cartItemId);

    void removeCartItem(CartItem cartItem);

    CartItem save(CartItem cartItem);
}
