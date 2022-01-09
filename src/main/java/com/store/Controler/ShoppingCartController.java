package com.store.Controler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.Domain.*;
import com.store.Dto.BuyBookDto;
import com.store.Dto.ShoppingCartCheckoutDto;
import com.store.Dto.UpdateCartItemDto;
import com.store.Service.*;
import com.store.Utility.JwtUtil;
import com.store.Utility.MailConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.websocket.server.PathParam;
import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/shoppingCart")
public class ShoppingCartController {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MailConstructor mailConstructor;

    @Autowired
    private UserService userService;

    @Autowired
    private CartItemService cartItemService;

    @Autowired
    private ShoppingCartService shoppingCartService;

    @Autowired
    private UserShippingService userShippingService;

    @Autowired
    private BillingAddressService billingAddressService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private ShippingAddressService shippingAddressService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtil jwtUtil;

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private ShippingAddress shippingAddress = new ShippingAddress();
    private BillingAddress billingAddress = new BillingAddress();

    @RequestMapping("/cart")
    public ResponseEntity<Model> shoppingCart(@PathParam("token") String token, Model model) {
        String userName = jwtUtil.parseToken(token);

        User user = userService.findByUsername(userName);
        ShoppingCart shoppingCart = user.getShoppingCart();

        List<CartItem> cartItemList = cartItemService.findByShoppingCart(shoppingCart);
        shoppingCartService.updateShoppingCart(shoppingCart);

        model.addAttribute("cartItemList", cartItemList);
        model.addAttribute("shoppingCart", shoppingCart);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "/updateCartItem", method = RequestMethod.PUT)
    public ResponseEntity<Model> updateShoppingCart(HttpServletRequest request, Model model) throws IOException {

        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        UpdateCartItemDto cartItemDto = objectMapper.readValue(requestBody, UpdateCartItemDto.class);

        String userName = jwtUtil.parseToken(cartItemDto.getToken());
        User user = userService.findByUsername(userName);

        if (Objects.isNull(user)) {
            return new ResponseEntity<>(model, HttpStatus.UNAUTHORIZED);
        }

        CartItem cartItem = cartItemService.findById(cartItemDto.getCartItemId());
        int quantity = cartItem.getBook().getInStockNumber();

        if (quantity >= cartItemDto.getQty()) {
            cartItem.setQty(cartItemDto.getQty());
            cartItemService.updateCartItem(cartItem);
        } else {
            model.addAttribute("notEnoughStock", true);
            return new ResponseEntity<>(model, HttpStatus.NOT_ACCEPTABLE);
        }

        return new ResponseEntity<>(model, HttpStatus.OK); //"forward:/shoppingCart/cart"
    }

    @RequestMapping(value = "/removeItem", method = RequestMethod.DELETE)
    public ResponseEntity<Model> removeItem(HttpServletRequest request, Model model) throws IOException {
        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        UpdateCartItemDto cartItemDto = objectMapper.readValue(requestBody, UpdateCartItemDto.class);

        String userName = jwtUtil.parseToken(cartItemDto.getToken());

        User user = userService.findByUsername(userName);

        if (Objects.isNull(user)) {
            return new ResponseEntity<>(model, HttpStatus.UNAUTHORIZED);
        }

        cartItemService.removeCartItem(cartItemService.findById(cartItemDto.getCartItemId()));
        model.addAttribute("deleteSuccessFull", true);
        model.addAttribute("user", user);

        return new ResponseEntity<>(model, HttpStatus.OK); //"forward:/shoppingCart/cart"
    }

    @RequestMapping("/cartCheckout")
    public ResponseEntity<Model> checkout(@RequestParam("id") Long cartId,
                                          @RequestParam(value = "token") String token, Model model) {
        String userName = jwtUtil.parseToken(token);

        User user = userService.findByUsername(userName);

        if (!Objects.equals(cartId, user.getShoppingCart().getId())) {
            return new ResponseEntity<>(model, HttpStatus.UNAUTHORIZED);
        }

        List<CartItem> cartItemList = cartItemService.findByShoppingCart(user.getShoppingCart());

        if (cartItemList.size() == 0) {
            model.addAttribute("emptyCart", true);
            return new ResponseEntity<>(model, HttpStatus.FORBIDDEN); //"forward:/shoppingCart/cart"
        }

        for (CartItem cartItem : cartItemList) {
            if (cartItem.getBook().getInStockNumber() < cartItem.getQty()) {
                model.addAttribute("notEnoughStock", true);
                return new ResponseEntity<>(model, HttpStatus.FORBIDDEN); //"forward:/shoppingCart/cart"
            }
        }

        if (user.getBalance() < user.getShoppingCart().getTotalPrize().doubleValue()) {
            model.addAttribute("insufficientUserBalance", true);
            return new ResponseEntity<>(model, HttpStatus.FORBIDDEN); //"forward:/shoppingCart/cart"
        } else {
            model.addAttribute("insufficientUserBalance", false);
        }

        List<UserShipping> userShippingList = user.getUserShippingList();
        model.addAttribute("userShippingList", userShippingList);

        if (userShippingList.size() == 0) {
            model.addAttribute("emptyShippingList", true);
        } else {
            model.addAttribute("emptyShippingList", false);
        }

        ShoppingCart shoppingCart = user.getShoppingCart();

        for (UserShipping userShipping : userShippingList) {
            if (userShipping.isUserShippingDefault()) {
                shippingAddressService.setByUserShipping(userShipping, shippingAddress);
            }
        }

        model.addAttribute("shippingAddress", shippingAddress);
        model.addAttribute("billingAddress", billingAddress);
        model.addAttribute("cartItemList", cartItemList);
        model.addAttribute("shoppingCart", shoppingCart);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "/cartCheckout", method = RequestMethod.POST)
    public ResponseEntity<Model> checkoutPost(HttpServletRequest request, Model model) throws IOException {
        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        ShoppingCartCheckoutDto shoppingCartCheckoutDto = objectMapper.readValue(requestBody, ShoppingCartCheckoutDto.class);

        String userName = jwtUtil.parseToken(shoppingCartCheckoutDto.getToken());

        ShoppingCart shoppingCart = userService.findByUsername(userName).getShoppingCart();

        List<CartItem> cartItemList = cartItemService.findByShoppingCart(shoppingCart);
        model.addAttribute("cartItemList", cartItemList);

        ShippingAddress shippingAddress = shoppingCartCheckoutDto.getShippingAddress();
        BillingAddress billingAddress = shoppingCartCheckoutDto.getBillingAddress();

        if (shoppingCartCheckoutDto.getBillingSameAsShipping()) {
            billingAddress.setBillingAddressName(shippingAddress.getShippingAddressName());
            billingAddress.setBillingAddressStreet1(shippingAddress.getShippingAddressStreet1());
            billingAddress.setBillingAddressStreet2(shippingAddress.getShippingAddressStreet2());
            billingAddress.setBillingAddressCity(shippingAddress.getShippingAddressCity());
            billingAddress.setBillingAddressState(shippingAddress.getShippingAddressState());
            billingAddress.setBillingAddressCountry(shippingAddress.getShippingAddressCountry());
            billingAddress.setBillingAddressZipcode(shippingAddress.getShippingAddressZipcode());
        }

        if (shippingAddress.getShippingAddressStreet1().isEmpty()
                || shippingAddress.getShippingAddressCity().isEmpty()
                || shippingAddress.getShippingAddressState().isEmpty()
                || shippingAddress.getShippingAddressName().isEmpty()
                || shippingAddress.getShippingAddressZipcode().isEmpty()
                || billingAddress.getBillingAddressStreet1().isEmpty()
                || billingAddress.getBillingAddressCity().isEmpty()
                || billingAddress.getBillingAddressState().isEmpty()
                || billingAddress.getBillingAddressName().isEmpty()
                || billingAddress.getBillingAddressZipcode().isEmpty()) {
            return new ResponseEntity<>(model, HttpStatus.FORBIDDEN); //"redirect:/checkout?id=" + shoppingCart.getId() + "&missingRequiredField=true"
        }

        User user = userService.findByUsername(userName);

        if (!Objects.equals(user.getId(), user.getShoppingCart().getUser().getId())) {
            return new ResponseEntity<>(model, HttpStatus.UNAUTHORIZED);
        }

        Order order = orderService.createOrder(shoppingCart, shippingAddress, billingAddress, shoppingCartCheckoutDto.getShippingMethod(), user);
        user.setBalance(Math.round((user.getBalance() - order.getOrderTotal().doubleValue()) * 100.00) / 100.00);
        userService.save(user);

        mailSender.send(mailConstructor.constructOrderConfirmationEmail(user, order, Locale.ENGLISH));

        shoppingCartService.clearShoppingCart(shoppingCart);

        model.addAttribute("estimatedDeliveryDate", order.getShippingDate());

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping("/setShippingAddress")
    public ResponseEntity<Model> setShippingAddress(@RequestParam("userShippingId") Long userShippingId, Principal principal,
                                                    Model model) {
        User user = userService.findByUsername(principal.getName());
        UserShipping userShipping = userShippingService.findById(userShippingId);

        if (!userShipping.getUser().getId().equals(user.getId())) {
            return new ResponseEntity<>(model, HttpStatus.UNAUTHORIZED);
        } else {
            shippingAddressService.setByUserShipping(userShipping, shippingAddress);

            List<CartItem> cartItemList = cartItemService.findByShoppingCart(user.getShoppingCart());

            model.addAttribute("shippingAddress", shippingAddress);
            model.addAttribute("billingAddress", billingAddress);
            model.addAttribute("cartItemList", cartItemList);
            model.addAttribute("shoppingCart", user.getShoppingCart());

            List<UserShipping> userShippingList = user.getUserShippingList();
            model.addAttribute("userShippingList", userShippingList);

            model.addAttribute("classActiveShipping", true);
            model.addAttribute("emptyShippingList", false);

            return new ResponseEntity<>(model, HttpStatus.OK);
        }
    }
}
