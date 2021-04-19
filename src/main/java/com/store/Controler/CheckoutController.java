package com.store.Controler;


import com.store.Domain.BalanceRequest;
import com.store.Domain.Book;
import com.store.Domain.User;
import com.store.Service.BalanceService;
import com.store.Service.BookService;
import com.store.Service.UserService;
import com.store.Utility.MailConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
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
    private JavaMailSender mailSender;

    @Autowired
    private MailConstructor mailConstructor;

    @Autowired
    private UserService userService;

    @Autowired
    private BookService bookService;

    @Autowired
    private BalanceService balanceService;


    @RequestMapping("/buyItem")
    public String buyItem(
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
            return "forward:/bookDetail?id=" + book.getId();
        }
        model.addAttribute("user", user);
        model.addAttribute("addBookSuccess", true);

        return "redirect:/checkout?id=" + book.getId();
    }

    @RequestMapping("/checkout")
    public String checkout(@RequestParam("id") Long bookId, Model model,
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
            return "forward:/bookshelf";
        }

        model.addAttribute("classActiveShipping", true);

        return "checkout";

    }

    @RequestMapping(value = "/checkout", method = RequestMethod.POST)
    public String checkoutPost(@RequestParam("id") Long bookId, Principal principal, Model model) {


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
        user.setBalance((user.getBalance() - book.getOurPrice()));
        userService.save(user);

        return "orderSubmittedPage";
    }

    @RequestMapping(value = "/updateUserBalance",  method = RequestMethod.GET)
    public String balance(Model model, Principal principal) {

        User user = userService.findByUsername(principal.getName());
        BalanceRequest balanceRequest = new BalanceRequest();

        List<BalanceRequest> requestList = balanceService.findAll();
        int userIds = 0;

        for(BalanceRequest request : requestList) {
            if(Objects.equals(request.getUser().getId(), user.getId())){
                userIds++;
            }
        }
        model.addAttribute("numberOfRequests", userIds);

        if(userIds >= 3) {
            model.addAttribute("tooManyRequests",true);
        }
        else {
            model.addAttribute("tooManyRequests",false);
        }

        model.addAttribute("user", user);

        model.addAttribute("balanceRequest", balanceRequest);
        model.addAttribute("classActiveBalance", true);

        return "balance";
    }


    @RequestMapping(value = "/updateUserBalance", method = RequestMethod.POST)
    public String addBalancePost(@ModelAttribute("balanceRequest") BalanceRequest balanceRequest,
                                 Principal principal, Model model) {

        User user = userService.findByUsername(principal.getName());
        BalanceRequest balanceRequest1 = balanceService.addBalance(user,balanceRequest);

        List<BalanceRequest> requestList = balanceService.findAll();
        int userIds = 0;

        for(BalanceRequest request : requestList) {
            if(Objects.equals(request.getUser().getId(), user.getId())){
                userIds++;
            }
        }
        model.addAttribute("numberOfRequests", userIds);

        if(userIds >= 3) {
            model.addAttribute("tooManyRequests",true);
            return "redirect:/updateUserBalance";
        }
        else {
            model.addAttribute("tooManyRequests",false);
        }

        model.addAttribute("user", user);
        model.addAttribute("balanceRequest", balanceRequest);
        model.addAttribute("classActiveBalance", true);
        model.addAttribute("balanceUpdateSuccess", true);
        return "balance";
    }


}
