package com.store.Controler;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.Domain.*;
import com.store.Dto.BalanceRequestDto;
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

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @RequestMapping(value = "/buyItem", params = "buyBook")
    public ResponseEntity<Model> buyItem(
            @ModelAttribute("book") Book book,
            Model model, Principal principal
    ) {
        User user = userService.findByUsername(principal.getName());
        book = bookService.findById(book.getId()).orElse(null);

        if (user.getBalance() < Objects.requireNonNull(book).getOurPrice()) {
            model.addAttribute("insufficientUserBalance", true);
        } else {
            model.addAttribute("insufficientUserBalance", false);
        }

        if (1 > book.getInStockNumber()) {
            model.addAttribute("notEnoughStock", true);
            return new ResponseEntity<>(model, HttpStatus.CONTINUE); //"forward:/bookDetail?id=" + book.getId()
        }
        model.addAttribute("user", user);
        model.addAttribute("addBookSuccess", true);

        return new ResponseEntity<>(model, HttpStatus.CONTINUE); //"redirect:/checkout?id=" + book.getId()
    }

    @RequestMapping(value = "/buyItem", method = RequestMethod.POST, params = "addToCart")
    public ResponseEntity<Model> addItem(@ModelAttribute("book") Book book,
                                         @ModelAttribute("qty") String quantity,
                                         Model model, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        book = bookService.findById(book.getId()).orElse(null);

        if (Integer.parseInt(quantity) > Objects.requireNonNull(book).getInStockNumber()) {
            model.addAttribute("notEnoughStock", true);
            return new ResponseEntity<>(model, HttpStatus.CONTINUE); //"forward:/bookDetail?id=" + book.getId()
        }

        CartItem cartItem = cartItemService.addBookToCartItem(book, user, Integer.parseInt(quantity));
        model.addAttribute("addBookSuccess");
        return new ResponseEntity<>(model, HttpStatus.CONTINUE); //"forward:/shoppingCart/cart"

    }

    @RequestMapping("/checkout")
    public ResponseEntity<Model> checkout(@RequestParam("id") Long bookId, Model model,
                                          Principal principal) {
        User user = userService.findByUsername(principal.getName());

        Book book = bookService.findById(bookId).orElse(null);
        model.addAttribute("book", book);

        if (user.getBalance() < Objects.requireNonNull(book).getOurPrice()) {
            model.addAttribute("insufficientUserBalance", true);
        } else {
            model.addAttribute("insufficientUserBalance", false);
        }

        if (Objects.requireNonNull(book).getInStockNumber() < 1) {
            model.addAttribute("notEnoughStock", true);
            return new ResponseEntity<>(model, HttpStatus.CONTINUE); //"forward:/bookshelf"
        }

        model.addAttribute("classActiveShipping", true);

        return new ResponseEntity<>(model, HttpStatus.OK);

    }

    @RequestMapping(value = "/checkout", method = RequestMethod.POST)
    public ResponseEntity<Model> checkoutPost(
            @ModelAttribute("shippingAddress") ShippingAddress shippingAddress,
            @ModelAttribute("billingAddress") BillingAddress billingAddress,
            @ModelAttribute("shippingMethod") String shippingMethod,
            @RequestParam("id") Long bookId, Principal principal, Model model) {

        Book book = bookService.findById(bookId).orElse(null);
        User user = userService.findByUsername(principal.getName());

        if (user.getBalance() < Objects.requireNonNull(book).getOurPrice()) {
            model.addAttribute("insufficientUserBalance", true);
        } else {
            model.addAttribute("insufficientUserBalance", false);
        }

        model.addAttribute("classActiveOrderCheckout", true);
        model.addAttribute("book", book);

        Objects.requireNonNull(book).setInStockNumber(book.getInStockNumber() - 1);
        Order order = orderService.createOrder(book, shippingAddress, billingAddress, shippingMethod, user);

        mailSender.send(mailConstructor.constructOrderConfirmationEmail(user, order, Locale.ENGLISH));

        user.setBalance(Math.round((user.getBalance() - book.getOurPrice()) * 100.0) / 100.0);
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
