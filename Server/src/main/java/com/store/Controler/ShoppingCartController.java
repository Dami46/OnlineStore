package com.store.Controler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.Domain.*;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.websocket.server.PathParam;
import java.io.IOException;
import java.security.Principal;
import java.util.List;
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

        return new ResponseEntity<>(model, HttpStatus.OK);
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
        shoppingCartService.updateShoppingCart(user.getShoppingCart());
        model.addAttribute("deleteSuccessFull", true);
        model.addAttribute("user", user);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "/buyItems", method = RequestMethod.POST)
    public ResponseEntity<Model> buyItem(@RequestParam("id") Long cartId,
                                         @RequestParam(value = "token") String token, Model model) {

        String userName = jwtUtil.parseToken(token);
        User user = userService.findByUsername(userName);

        List<CartItem> cartItemList = cartItemService.findByShoppingCart(user.getShoppingCart());

        if (!Objects.equals(cartId, user.getShoppingCart().getId())) {
            return new ResponseEntity<>(model, HttpStatus.UNAUTHORIZED);
        }

        if (cartItemList.size() == 0) {
            model.addAttribute("emptyCart", true);
            return new ResponseEntity<>(model, HttpStatus.FORBIDDEN);
        }

        if (user.getBalance() < user.getShoppingCart().getTotalPrize().doubleValue()) {
            model.addAttribute("insufficientUserBalance", true);
            return new ResponseEntity<>(model, HttpStatus.FORBIDDEN);
        }

        for (CartItem cartItem : cartItemList) {
            if (cartItem.getBook().getInStockNumber() < cartItem.getQty()) {
                model.addAttribute("notEnoughStock", true);
                return new ResponseEntity<>(model, HttpStatus.FORBIDDEN);
            }
        }

        model.addAttribute("user", user);
        model.addAttribute("cartCheckoutSuccess", true);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping("/cartCheckout")
    public ResponseEntity<Model> checkout(@RequestParam(value = "token") String token, Model model) {

        String userName = jwtUtil.parseToken(token);
        User user = userService.findByUsername(userName);

        List<CartItem> cartItemList = cartItemService.findByShoppingCart(user.getShoppingCart());

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

        for (CartItem cartItem : cartItemList) {
            if (cartItem.getBook().getInStockNumber() < cartItem.getQty()) {
                model.addAttribute("notEnoughStock", true);
                return new ResponseEntity<>(model, HttpStatus.FORBIDDEN);
            }
        }

        User user = userService.findByUsername(userName);

        if (user.getBalance() < user.getShoppingCart().getTotalPrize().doubleValue() + 5.0) {
            model.addAttribute("insufficientUserBalance", true);
            return new ResponseEntity<>(model, HttpStatus.FORBIDDEN);
        }

        ShippingAddress shippingAddress = shoppingCartCheckoutDto.getShippingAddress();
        BillingAddress billingAddress = shoppingCartCheckoutDto.getBillingAddress();

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
            return new ResponseEntity<>(model, HttpStatus.FORBIDDEN);
        }

        if (!Objects.equals(user.getId(), user.getShoppingCart().getUser().getId())) {
            return new ResponseEntity<>(model, HttpStatus.UNAUTHORIZED);
        }

        double shippingPrice = 5.00;
        if (Objects.equals(shoppingCartCheckoutDto.getShippingMethod(), "premiumShipping")) {
            shippingPrice = 10.00;
        }

        Order order = orderService.createOrder(shoppingCart, shippingAddress, billingAddress, shoppingCartCheckoutDto.getShippingMethod(), user);
        user.setBalance(Math.round((user.getBalance() - order.getOrderTotal().doubleValue() - shippingPrice) * 100.00) / 100.00);
        userService.save(user);

        shoppingCartService.clearShoppingCart(shoppingCart);

        mailSender.send(mailConstructor.constructOrderConfirmationEmail(user, order));

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
