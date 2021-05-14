package com.store.Service.Impl;

import com.store.Domain.CartItem;
import com.store.Domain.ShoppingCart;
import com.store.Repository.ShoppingCartRepository;
import com.store.Service.CartItemService;
import com.store.Service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

    @Autowired
    private CartItemService cartItemService;

    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    @Override
    public ShoppingCart updateShoppingCart(ShoppingCart shoppingCart) {
        BigDecimal cartTotal = new BigDecimal(0);
        List<CartItem> cartItemList = cartItemService.findByShoppingCart(shoppingCart);

        for(CartItem cartItem : cartItemList) {
            if(cartItem.getBook().getInStockNumber() > 0) {
                cartItemService.updateCartItem(cartItem);
                cartTotal=cartTotal.add(cartItem.getSubtotal());
            }
        }
        shoppingCart.setTotalPrize(cartTotal);
        shoppingCartRepository.save(shoppingCart);

        return shoppingCart;
    }
}
