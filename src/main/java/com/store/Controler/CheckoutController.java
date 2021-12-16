package com.store.Controler;


import com.store.Domain.BalanceRequest;
import com.store.Domain.Book;
import com.store.Domain.CartItem;
import com.store.Domain.User;
import com.store.Service.BalanceService;
import com.store.Service.BookService;
import com.store.Service.CartItemService;
import com.store.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;
import java.util.List;
import java.util.Objects;

@Controller
public class CheckoutController {


    @Autowired
    private UserService userService;

    @Autowired
    private BookService bookService;

    @Autowired
    private BalanceService balanceService;

    @Autowired
    private CartItemService cartItemService;


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
    public ResponseEntity<Model> checkoutPost(@RequestParam("id") Long bookId, Principal principal, Model model) {


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
        user.setBalance(Math.round((user.getBalance() - book.getOurPrice()) * 100.0) / 100.0);
        userService.save(user);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "/updateUserBalance", method = RequestMethod.GET)
    public ResponseEntity<Model> balance(Model model, Principal principal) {

        User user = userService.findByUsername(principal.getName());
        BalanceRequest balanceRequest = new BalanceRequest();

        List<BalanceRequest> requestList = balanceService.findAll();
        int userIds = 0;

        for (BalanceRequest request : requestList) {
            if (Objects.equals(request.getUser().getId(), user.getId())) {
                userIds++;
            }
        }
        model.addAttribute("numberOfRequests", userIds);

        if (userIds >= 3) {
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
    public ResponseEntity<Model> addBalancePost(@ModelAttribute("balanceRequest") BalanceRequest balanceRequest,
                                                Principal principal, Model model) {

        User user = userService.findByUsername(principal.getName());
        BalanceRequest balanceRequest1 = balanceService.addBalance(user, balanceRequest);

        List<BalanceRequest> requestList = balanceService.findAll();
        int userIds = 0;

        for (BalanceRequest request : requestList) {
            if (Objects.equals(request.getUser().getId(), user.getId())) {
                userIds++;
            }
        }
        model.addAttribute("numberOfRequests", userIds);

        if (userIds >= 3) {
            model.addAttribute("tooManyRequests", true);
            return new ResponseEntity<>(model, HttpStatus.CONTINUE);  //"redirect:/updateUserBalance"
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
