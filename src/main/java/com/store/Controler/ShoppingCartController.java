package com.store.Controler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.Domain.*;
import com.store.Service.*;
import com.store.Utility.JwtUtil;
import com.store.Utility.MailConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.security.Principal;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

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
    private Payment payment = new Payment();

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

    @RequestMapping("/updateCartItem")
    public ResponseEntity<Model> updateShoppingCart(
            @ModelAttribute("id") Long cartItemId,
            @ModelAttribute("qty") int qty, Model model
    ) {
        CartItem cartItem = cartItemService.findById(cartItemId);
        int quantity = cartItem.getBook().getInStockNumber();
        if (quantity >= qty) {
            cartItem.setQty(qty);
            cartItemService.updateCartItem(cartItem);
        } else {
            model.addAttribute("notEnoughStock", true);
        }

        return new ResponseEntity<>(model, HttpStatus.OK); //"forward:/shoppingCart/cart"
    }

    @RequestMapping("/removeItem")
    public ResponseEntity<?> removeItem(@RequestParam("id") Long id) {
        cartItemService.removeCartItem(cartItemService.findById(id));

        return new ResponseEntity<>(HttpStatus.OK); //"forward:/shoppingCart/cart"
    }

    @RequestMapping("/cartCheckout")
    public ResponseEntity<Model> checkout(@RequestParam("id") Long cartId,
                                          @RequestParam(value = "missingRequiredField", required = false) boolean missingRequiredField, Model model,
                                          Principal principal) {
        User user = userService.findByUsername(principal.getName());

        if (!Objects.equals(cartId, user.getShoppingCart().getId())) {
            return new ResponseEntity<>(model, HttpStatus.BAD_REQUEST);
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
        List<UserPayment> userPaymentList = user.getUserPaymentList();

        model.addAttribute("userShippingList", userShippingList);
        model.addAttribute("userPaymentList", userPaymentList);

        if (userPaymentList.size() == 0) {
            model.addAttribute("emptyPaymentList", true);
        } else {
            model.addAttribute("emptyPaymentList", false);
        }

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

        for (UserPayment userPayment : userPaymentList) {
            if (userPayment.isDefaultPayment()) {
                paymentService.setByUserPayment(userPayment, payment);
                billingAddressService.setByUserBilling(userPayment.getUserBilling(), billingAddress);
            }
        }

        model.addAttribute("shippingAddress", shippingAddress);
        model.addAttribute("payment", payment);
        model.addAttribute("billingAddress", billingAddress);
        model.addAttribute("cartItemList", cartItemList);
        model.addAttribute("shoppingCart", user.getShoppingCart());

        model.addAttribute("classActiveShipping", true);

        if (missingRequiredField) {
            model.addAttribute("missingRequiredField", true);
        }

        return new ResponseEntity<>(model, HttpStatus.OK);

    }

    @RequestMapping(value = "/cartCheckout", method = RequestMethod.POST)
    public ResponseEntity<Model> checkoutPost(@ModelAttribute("shippingAddress") ShippingAddress shippingAddress,
                                              @ModelAttribute("billingAddress") BillingAddress billingAddress,
                                              @ModelAttribute("payment") Payment payment,
                                              @ModelAttribute("billingSameAsShipping") String billingSameAsShipping,
                                              @ModelAttribute("shippingMethod") String shippingMethod, Principal principal, Model model) {
        ShoppingCart shoppingCart = userService.findByUsername(principal.getName()).getShoppingCart();

        List<CartItem> cartItemList = cartItemService.findByShoppingCart(shoppingCart);
        model.addAttribute("cartItemList", cartItemList);


        if (billingSameAsShipping.equals("true")) {
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

        User user = userService.findByUsername(principal.getName());

        Order order = orderService.createOrder(shoppingCart, shippingAddress, billingAddress, shippingMethod, user);
        user.setBalance(Math.round((user.getBalance() - order.getOrderTotal().doubleValue()) * 100.00) / 100.00);

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
            return new ResponseEntity<>(model, HttpStatus.BAD_REQUEST);
        } else {
            shippingAddressService.setByUserShipping(userShipping, shippingAddress);

            List<CartItem> cartItemList = cartItemService.findByShoppingCart(user.getShoppingCart());

            model.addAttribute("shippingAddress", shippingAddress);
            model.addAttribute("payment", payment);
            model.addAttribute("billingAddress", billingAddress);
            model.addAttribute("cartItemList", cartItemList);
            model.addAttribute("shoppingCart", user.getShoppingCart());

            List<UserShipping> userShippingList = user.getUserShippingList();
            List<UserPayment> userPaymentList = user.getUserPaymentList();

            model.addAttribute("userShippingList", userShippingList);
            model.addAttribute("userPaymentList", userPaymentList);

            model.addAttribute("shippingAddress", shippingAddress);

            model.addAttribute("classActiveShipping", true);

            if (userPaymentList.size() == 0) {
                model.addAttribute("emptyPaymentList", true);
            } else {
                model.addAttribute("emptyPaymentList", false);
            }

            model.addAttribute("emptyShippingList", false);

            return new ResponseEntity<>(model, HttpStatus.OK);
        }
    }
}
