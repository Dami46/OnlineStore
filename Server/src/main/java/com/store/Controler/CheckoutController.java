package com.store.Controler;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.Domain.*;
import com.store.Dto.BalanceRequestDto;
import com.store.Dto.BookCheckoutDto;
import com.store.Dto.BuyBookDto;
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
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
public class CheckoutController {

    @Autowired
    private UserService userService;

    @Autowired
    private BookService bookService;

    @Autowired
    private BalanceService balanceService;

    @Autowired
    private CartItemService cartItemService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MailConstructor mailConstructor;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ShippingAddressService shippingAddressService;

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private ShippingAddress shippingAddress = new ShippingAddress();

    @RequestMapping(value = "/buyItem", params = "buyBook", method = RequestMethod.POST)
    public ResponseEntity<Model> buyItem(HttpServletRequest request, Model model) throws IOException {

        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        BuyBookDto bookDto = objectMapper.readValue(requestBody, BuyBookDto.class);

        String userName = jwtUtil.parseToken(bookDto.getToken());

        User user = userService.findByUsername(userName);
        Book book = bookService.findById(bookDto.getId()).orElse(null);

        if (user.getBalance() < Objects.requireNonNull(book).getOurPrice() + 5.0) {
            model.addAttribute("insufficientUserBalance", true);
        } else {
            model.addAttribute("insufficientUserBalance", false);
        }

        if (1 > book.getInStockNumber()) {
            model.addAttribute("notEnoughStock", true);
            return new ResponseEntity<>(model, HttpStatus.NOT_ACCEPTABLE); //"forward:/bookDetail?id=" + book.getId()
        }
        model.addAttribute("user", user);
        model.addAttribute("addBookSuccess", true);

        return new ResponseEntity<>(model, HttpStatus.OK); //"redirect:/checkout?id=" + book.getId()
    }

    @RequestMapping(value = "/buyItem", method = RequestMethod.POST, params = "addToCart")
    public ResponseEntity<Model> addItem(HttpServletRequest request, Model model) throws IOException {

        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        BuyBookDto bookDto = objectMapper.readValue(requestBody, BuyBookDto.class);

        String userName = jwtUtil.parseToken(bookDto.getToken());

        User user = userService.findByUsername(userName);
        Book book = bookService.findById(bookDto.getId()).orElse(null);

        if (bookDto.getQuantity() > Objects.requireNonNull(book).getInStockNumber()) {
            model.addAttribute("notEnoughStock", true);
            return new ResponseEntity<>(model, HttpStatus.NOT_ACCEPTABLE); //"forward:/bookDetail?id=" + book.getId()
        }

        CartItem cartItem = cartItemService.addBookToCartItem(book, user, bookDto.getQuantity());
        model.addAttribute("addBookSuccess");
        return new ResponseEntity<>(model, HttpStatus.OK); //"forward:/shoppingCart/cart"

    }

    @RequestMapping("/checkout")
    public ResponseEntity<Model> checkout(@RequestParam("id") Long bookId, @RequestParam("token") String token, Model model) {
        String userName = jwtUtil.parseToken(token);

        User user = userService.findByUsername(userName);

        Book book = bookService.findById(bookId).orElse(null);
        model.addAttribute("book", book);

        if (user.getBalance() < Objects.requireNonNull(book).getOurPrice()) {
            model.addAttribute("insufficientUserBalance", true);
            return new ResponseEntity<>(model, HttpStatus.NOT_ACCEPTABLE);
        } else {
            model.addAttribute("insufficientUserBalance", false);
        }

        List<UserShipping> userShippingList = user.getUserShippingList();

        if (userShippingList.size() == 0) {
            model.addAttribute("emptyShippingList", true);
        } else {
            model.addAttribute("emptyShippingList", false);
        }

        for (UserShipping userShipping : userShippingList) {
            if (userShipping.isUserShippingDefault()) {
                shippingAddressService.setByUserShipping(userShipping, shippingAddress);
            }
        }

        model.addAttribute("shippingAddress", shippingAddress);

        return new ResponseEntity<>(model, HttpStatus.OK);

    }

    @RequestMapping(value = "/checkout", method = RequestMethod.POST)
    public ResponseEntity<Model> checkoutPost(HttpServletRequest request, Model model) throws IOException {

        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        BookCheckoutDto checkoutDto = objectMapper.readValue(requestBody, BookCheckoutDto.class);

        String userName = jwtUtil.parseToken(checkoutDto.getToken());

        Book book = bookService.findById(checkoutDto.getBookId()).orElse(null);
        User user = userService.findByUsername(userName);

        if (user.getBalance() < Objects.requireNonNull(book).getOurPrice() + 5.0) {
            model.addAttribute("insufficientUserBalance", true);
            return new ResponseEntity<>(model, HttpStatus.NOT_ACCEPTABLE);
        } else {
            model.addAttribute("insufficientUserBalance", false);
        }

        if (Objects.requireNonNull(book).getInStockNumber() < 1) {
            model.addAttribute("notEnoughStock", true);
            return new ResponseEntity<>(model, HttpStatus.NOT_ACCEPTABLE); //"forward:/bookshelf"
        }

        model.addAttribute("classActiveOrderCheckout", true);
        model.addAttribute("book", book);

        ShippingAddress shippingAddress = checkoutDto.getShippingAddress();
        BillingAddress billingAddress = checkoutDto.getBillingAddress();

        orderService.saveShippingAddress(shippingAddress);
        orderService.saveBillingAddress(billingAddress);

        Objects.requireNonNull(book).setInStockNumber(book.getInStockNumber() - 1);
        Order order = orderService.createOrder(book, shippingAddress, billingAddress, checkoutDto.getShippingMethod(), user);

        mailSender.send(mailConstructor.constructOrderConfirmationEmail(user, order, book));

        double shippingPrice = 5.00;
        if (Objects.equals(checkoutDto.getShippingMethod(), "premiumShipping")) {
            shippingPrice = 10.00;
        }

        user.setBalance(Math.round((user.getBalance() - book.getOurPrice() - shippingPrice) * 100.0) / 100.0);
        userService.save(user);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "/updateUserBalance", method = RequestMethod.GET)
    public ResponseEntity<Model> balance(@PathParam("token") String token, Model model) {

        String userName = jwtUtil.parseToken(token);
        User user = userService.findByUsername(userName);
        BalanceRequest balanceRequest = new BalanceRequest();

        List<BalanceRequest> requestList = balanceService.findAll();
        int userRequests = 0;

        for (BalanceRequest request : requestList) {
            if (Objects.equals(request.getUser().getId(), user.getId())) {
                userRequests++;
            }
        }
        model.addAttribute("numberOfRequests", userRequests);

        if (userRequests >= 3) {
            model.addAttribute("tooManyRequests", true);
        } else {
            model.addAttribute("tooManyRequests", false);
        }

        model.addAttribute("user", user);

        model.addAttribute("balanceRequest", balanceRequest);
        model.addAttribute("classActiveBalance", true);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }


    @RequestMapping(value = "/updateUserBalance", method = RequestMethod.POST)
    public ResponseEntity<Model> addBalancePost(HttpServletRequest httpServletRequest, Model model) throws IOException {

        String requestBody = httpServletRequest.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        BalanceRequestDto balanceRequestDto = objectMapper.readValue(requestBody, BalanceRequestDto.class);
        String userName = jwtUtil.parseToken(balanceRequestDto.getToken());

        User user = userService.findByUsername(userName);
        BalanceRequest balanceRequest = new BalanceRequest();
        balanceRequest.setUser(user);
        balanceRequest.setSumToAdd(balanceRequestDto.getSumToAdd());

        balanceService.addBalance(balanceRequest);

        List<BalanceRequest> requestList = balanceService.findAll();
        int userRequests = 0;

        for (BalanceRequest request : requestList) {
            if (Objects.equals(request.getUser().getId(), user.getId())) {
                userRequests++;
            }
        }
        model.addAttribute("numberOfRequests", userRequests);

        if (userRequests >= 3) {
            model.addAttribute("tooManyRequests", true);
            return new ResponseEntity<>(model, HttpStatus.TOO_MANY_REQUESTS);  //"redirect:/updateUserBalance"
        } else {
            model.addAttribute("tooManyRequests", false);
        }

        model.addAttribute("user", user);
        model.addAttribute("balanceRequest", balanceRequest);
        model.addAttribute("classActiveBalance", true);
        model.addAttribute("balanceUpdateSuccess", true);
        return new ResponseEntity<>(model, HttpStatus.OK);
    }


}
