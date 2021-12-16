package com.store.Controler;

import com.store.Domain.Book;
import com.store.Domain.User;
import com.store.Service.BookService;
import com.store.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;
import java.util.List;

@Controller
public class SearchController {

    @Autowired
    private UserService userService;

    @Autowired
    private BookService bookService;

    @RequestMapping("/searchByCategory")
    public ResponseEntity<Model> searchByCategory(@RequestParam("category") String category, Model model, Principal principal) {

        if (principal != null) {
            String username = principal.getName();
            User user = userService.findByUsername(username);
            model.addAttribute("user", user);
        }

        String classActiveCategory = "active" + category;
        classActiveCategory = classActiveCategory.replaceAll("\\s+", "");
        classActiveCategory = classActiveCategory.replaceAll("&", "");
        model.addAttribute(classActiveCategory, true);

        List<Book> bookList = bookService.findByCategory(category);

        if (bookList.isEmpty()) {
            model.addAttribute("emptyList", true);
            return new ResponseEntity<>(model, HttpStatus.OK);
        }

        model.addAttribute("bookList", bookList);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping("/searchBook")
    public ResponseEntity<Model> searchBook(
            @ModelAttribute("keyword") String keyword,
            Principal principal, Model model
    ) {
        if (principal != null) {
            String username = principal.getName();
            User user = userService.findByUsername(username);
            model.addAttribute("user", user);
        }

        List<Book> bookList = bookService.blurrySearch(keyword);

        if (bookList.isEmpty()) {
            model.addAttribute("emptyList", true);
            return new ResponseEntity<>(model, HttpStatus.OK
            );
        }

        model.addAttribute("bookList", bookList);

        return new ResponseEntity<>(model, HttpStatus.CONTINUE);
    }
}
