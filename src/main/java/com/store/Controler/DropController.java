package com.store.Controler;

import com.store.Domain.Book;
import com.store.Domain.DropItem;
import com.store.Domain.User;
import com.store.Service.BookService;
import com.store.Service.DropService;
import com.store.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.websocket.server.PathParam;
import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Controller
public class DropController {

    @Autowired
    private UserService userService;

    @Autowired
    private BookService bookService;

    @Autowired
    private DropService dropService;


    @RequestMapping("/drop")
    public ResponseEntity<Model> dropList(Model model, Principal principal) {
        if (principal != null) {
            String username = principal.getName();
            User user = userService.findByUsername(username);
            model.addAttribute("user", user);
        }

        List<DropItem> itemToDropList = dropService.findAll();

        if (itemToDropList.isEmpty()) {
            model.addAttribute("emptyList", true);
            return new ResponseEntity<>(model, HttpStatus.NO_CONTENT);
        }

        for (DropItem dropItem : itemToDropList) {
            Optional<Book> book = bookService.findById(dropItem.getBookId());
            book.ifPresent(dropItem::setBook);
        }

        model.addAttribute("itemToDropList", itemToDropList);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping("/dropDetail")
    public ResponseEntity<Model> dropDetail(@PathParam("id") Long id, Model model, Principal principal) {

        User user = null;
        if (principal != null) {
            String username = principal.getName();
            user = userService.findByUsername(username);
            model.addAttribute("user", user);
        }

        DropItem dropItem = dropService.findById(id).orElse(null);

        if (Objects.nonNull(dropItem)) {
            Optional<Book> book = bookService.findById(dropItem.getBookId());
            book.ifPresent(dropItem::setBook);

            model.addAttribute("dropWasStarted", dropItem.isWasStarted());
        }

        if (Objects.nonNull(user)) {
            boolean userIsInDrop = dropService.checkIfUserIsInDrop(user, dropItem);
            model.addAttribute("userInDrop", userIsInDrop);
            if (userIsInDrop) {
                int placeInDrop = dropService.checkUserPlaceInDrop(user, dropItem);
                model.addAttribute("placeInDrop", placeInDrop);
            }
        }

        model.addAttribute("dropItem", dropItem);
        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping("/signForDrop")
    public ResponseEntity<Model> signForDrop(@ModelAttribute("id") Long dropItemId, Principal principal, Model model) {

        if (principal != null) {
            String username = principal.getName();
            User user = userService.findByUsername(username);
            model.addAttribute("user", user);

            DropItem dropItem = dropService.findById(dropItemId).orElse(null);

            boolean canAddToDrop = dropService.signForDrop(dropItem, user);

            if (!canAddToDrop) {
                dropService.signOutFromDrop(user, dropItem);
            } else {
                model.addAttribute("signForDrop", true);
            }
        }

        return new ResponseEntity<>(model, HttpStatus.OK); // "redirect:/dropDetail?id=" + dropItemId;
    }

}
