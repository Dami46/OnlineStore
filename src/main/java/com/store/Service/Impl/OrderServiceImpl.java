package com.store.Service.Impl;

import com.store.Domain.*;
import com.store.Repository.BillingAddressRepository;
import com.store.Repository.BookRepository;
import com.store.Repository.OrderRepository;
import com.store.Repository.ShippingAddressRepository;
import com.store.Service.CartItemService;
import com.store.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemService cartItemService;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ShippingAddressRepository shippingAddressRepository;

    @Autowired
    private BillingAddressRepository billingAddressRepository;

    @Override
    public void saveShippingAddress(ShippingAddress shippingAddress) {
        shippingAddressRepository.save(shippingAddress);
    }

    @Override
    public void saveBillingAddress(BillingAddress billingAddress) {
        billingAddressRepository.save(billingAddress);
    }

    @Override
    public synchronized Order createOrder(ShoppingCart shoppingCart, ShippingAddress shippingAddress,
                                          BillingAddress billingAddress, String shippingMethod, User user) {
        Order order = new Order();
        order.setBillingAddress(billingAddress);
        order.setOrderStatus("DONE");
        order.setShippingAddress(shippingAddress);
        order.setShippingMethod(shippingMethod);

        List<CartItem> cartItemList = cartItemService.findByShoppingCart(shoppingCart);

        for (CartItem cartItem : cartItemList) {
            Book book = cartItem.getBook();
            cartItem.setOrder(order);
            book.setInStockNumber(book.getInStockNumber() - cartItem.getQty());
            bookRepository.save(book);
        }
        order.setCartItemList(cartItemList);
        order.setOrderDate(Calendar.getInstance().getTime());
        order.setOrderTotal(shoppingCart.getTotalPrize());
        shippingAddress.setOrder(order);
        billingAddress.setOrder(order);
        order.setUser(user);
        order.setShippingDate(getDeliveryDate(shippingMethod));
        order = orderRepository.save(order);

        return order;
    }

    @Override
    public synchronized Order createOrder(Book book,ShippingAddress shippingAddress,
                                          BillingAddress billingAddress, String shippingMethod, User user) {
        Order order = new Order();
        order.setBillingAddress(billingAddress);
        order.setOrderStatus("DONE");
        order.setShippingAddress(shippingAddress);
        order.setShippingMethod(shippingMethod);
        order.setOrderTotal(BigDecimal.valueOf(book.getOurPrice()));
        order.setOrderDate(Calendar.getInstance().getTime());

        book.setInStockNumber(book.getInStockNumber() - 1);
        bookRepository.save(book);

        shippingAddress.setOrder(order);
        billingAddress.setOrder(order);
        order.setUser(user);
        order.setShippingDate(getDeliveryDate(shippingMethod));
        order = orderRepository.save(order);

        return order;
    }

    @Override
    public Order findOne(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Date getDeliveryDate (String shippingMethod) {
        LocalDate today = LocalDate.now();
        LocalDate estimatedDeliveryDate;

        if (shippingMethod.equals("groundShipping")) {
            estimatedDeliveryDate = today.plusDays(7);
        } else {
            estimatedDeliveryDate = today.plusDays(5);
        }

        return java.sql.Date.valueOf(estimatedDeliveryDate);

    }

}
