package com.store.Controler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.Domain.Book;
import com.store.Domain.DropItem;
import com.store.Domain.User;
import com.store.Dto.BuyBookDto;
import com.store.Dto.SignToDropDto;
import com.store.Service.BookService;
import com.store.Service.DropService;
import com.store.Service.UserService;
import com.store.Utility.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.websocket.server.PathParam;
import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
public class DropController {

    @Autowired
    private UserService userService;

    @Autowired
    private BookService bookService;

    @Autowired
    private DropService dropService;

    @Autowired
    private JwtUtil jwtUtil;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @RequestMapping("/drop")
    public ResponseEntity<Model> dropList(@RequestParam("token") String token, Model model) {

        if (token != null) {
            String userName = jwtUtil.parseToken(token);
            User user = userService.findByUsername(userName);
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
    public ResponseEntity<Model> dropDetail(@PathParam("id") Long id, @RequestParam("token") String token, Model model) {

        User user = null;

        if (token != null) {
            String userName = jwtUtil.parseToken(token);
            user = userService.findByUsername(userName);
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

    @RequestMapping(value = "/signForDrop", method = RequestMethod.POST)
    public ResponseEntity<Model> signForDrop(HttpServletRequest request, Model model) throws IOException {

        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        SignToDropDto signToDropDto = objectMapper.readValue(requestBody, SignToDropDto.class);

        if (signToDropDto.getToken() != null) {
            String userName = jwtUtil.parseToken(signToDropDto.getToken());
            User user = userService.findByUsername(userName);
            model.addAttribute("user", user);

            DropItem dropItem = dropService.findById(signToDropDto.getDropItemId()).orElse(null);

            boolean canAddToDrop = dropService.signForDrop(dropItem, user);

            if (!canAddToDrop) {
                dropService.signOutFromDrop(user, dropItem);
                model.addAttribute("signForDrop", false);
            } else {
                model.addAttribute("signForDrop", true);
            }
        } else {
            return new ResponseEntity<>(model, HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(model, HttpStatus.OK); // "redirect:/dropDetail?id=" + dropItemId;
    }

}
