package com.store.Controler;

import com.store.Domain.*;
import com.store.Security.PasswordResetToken;
import com.store.Security.Role;
import com.store.Security.UserRole;
import com.store.Service.*;
import com.store.Service.Impl.UserSecurityService;
import com.store.Utility.MailConstructor;
import com.store.Utility.SecurityUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.websocket.server.PathParam;
import java.security.Principal;
import java.util.*;

@RestController
public class HomeController {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MailConstructor mailConstructor;

    @Autowired
    private UserSecurityService userSecurityService;

    @Autowired
    private UserService userService;

    @Autowired
    private BookService bookService;

    @Autowired
    private UserShippingService userShippingService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartItemService cartItemService;

    @RequestMapping("/")
    public ResponseEntity<?> index() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "myProfile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Model> myAccount(Model model, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("user", user);
        model.addAttribute("userShippingList", user.getUserShippingList());
        model.addAttribute("orderList", user.getOrderList());
        UserShipping userShipping = new UserShipping();

        model.addAttribute("userShipping", userShipping);
        model.addAttribute("listOfShippingAddresses", true);
        model.addAttribute("classActiveEdit", true);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value="listOfShippingAddresses", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Model> listOfShippingAddresses(
            Model model, Principal principal, HttpServletRequest request
    ) {
        User user = userService.findByUsername(principal.getName());

        List<UserShipping> userShippingList = user.getUserShippingList();
        if (userShippingList.isEmpty()) {
            model.addAttribute("emptyList", true);
        } else {
            model.addAttribute("emptyList", false);
        }

        model.addAttribute("user", user);
        model.addAttribute("userPaymentList", user.getUserPaymentList());
        model.addAttribute("userShippingList", user.getUserShippingList());
        model.addAttribute("orderList", user.getOrderList());

        model.addAttribute("classActiveShipping", true);
        model.addAttribute("listOfShippingAddresses", true);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "orderDetail", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Model> orderDetail(@RequestParam("id") Long orderId, Principal principal, Model model) {
        User user = userService.findByUsername(principal.getName());
        Order order = orderService.findOne(orderId);

        if (!order.getUser().getId().equals(user.getId())) {
            return new ResponseEntity<>(model, HttpStatus.BAD_REQUEST);
        } else {
            List<CartItem> cartItemList = cartItemService.findByOrder(order);
            model.addAttribute("cartItemList", cartItemList);
            model.addAttribute("user", user);
            model.addAttribute("order", order);

            model.addAttribute("userPaymentList", user.getUserPaymentList());
            model.addAttribute("userShippingList", user.getUserShippingList());
            model.addAttribute("orderList", user.getOrderList());

            UserShipping userShipping = new UserShipping();
            model.addAttribute("userShipping", userShipping);
            model.addAttribute("listOfShippingAddresses", true);
            model.addAttribute("classActiveOrders", true);
            model.addAttribute("listOfCreditCards", true);
            model.addAttribute("displayOrderDetail", true);

            return new ResponseEntity<>(model, HttpStatus.OK);
        }
    }

    @RequestMapping(value = "addNewShippingAddress", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Model> addNewShippingAddress(
            Model model, Principal principal
    ) {
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("user", user);

        model.addAttribute("addNewShippingAddress", true);
        model.addAttribute("classActiveShipping", true);

        UserShipping userShipping = new UserShipping();

        model.addAttribute("userShipping", userShipping);

        model.addAttribute("userPaymentList", user.getUserPaymentList());
        model.addAttribute("userShippingList", user.getUserShippingList());
        model.addAttribute("orderList", user.getOrderList());

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "addNewShippingAddress", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Model> addNewShippingAddressPost(
            @ModelAttribute("userShipping") UserShipping userShipping,
            Principal principal, Model model
    ) {
        User user = userService.findByUsername(principal.getName());
        userService.updateUserShipping(userShipping, user);

        model.addAttribute("user", user);
        model.addAttribute("userShippingList", user.getUserShippingList());
        model.addAttribute("listOfShippingAddresses", true);
        model.addAttribute("classActiveShipping", true);
        model.addAttribute("orderList", user.getOrderList());

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "updateUserShipping",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Model> updateUserShipping(
            @ModelAttribute("id") Long shippingAddressId, Principal principal, Model model
    ) {
        User user = userService.findByUsername(principal.getName());
        UserShipping userShipping = userShippingService.findById(shippingAddressId);

        if (!user.getId().equals(userShipping.getUser().getId())) {
            return new ResponseEntity<>(model, HttpStatus.BAD_REQUEST);
        } else {
            model.addAttribute("user", user);
            model.addAttribute("userShipping", userShipping);

            model.addAttribute("addNewShippingAddress", true);
            model.addAttribute("classActiveShipping", true);
            model.addAttribute("userShippingList", user.getUserShippingList());
            model.addAttribute("orderList", user.getOrderList());

            return new ResponseEntity<>(model, HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/setDefaultShippingAddress", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Model> setDefaultShippingAddress(
            @ModelAttribute("defaultShippingAddressId") Long defaultShippingId, Principal principal, Model model
    ) {
        User user = userService.findByUsername(principal.getName());
        userService.setUserDefaultShipping(defaultShippingId, user);

        model.addAttribute("user", user);

        model.addAttribute("classActiveShipping", true);
        model.addAttribute("listOfShippingAddresses", true);

        model.addAttribute("userShippingList", user.getUserShippingList());
        model.addAttribute("orderList", user.getOrderList());

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "removeUserShipping", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Model> removeUserShipping(
            @ModelAttribute("id") Long userShippingId, Principal principal, Model model
    ) {
        User user = userService.findByUsername(principal.getName());
        UserShipping userShipping = userShippingService.findById(userShippingId);

        if (!Objects.equals(user.getId(), userShipping.getUser().getId())) {
            model.addAttribute("emptyList", true);
        } else {
            model.addAttribute("user", user);

            userShippingService.removeById(userShippingId);

            model.addAttribute("listOfShippingAddresses", true);
            model.addAttribute("classActiveShipping", true);

            model.addAttribute("userPaymentList", user.getUserPaymentList());
            model.addAttribute("userShippingList", user.getUserShippingList());
            model.addAttribute("orderList", user.getOrderList());

        }
        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "/updateUserInfo", method = RequestMethod.POST)
    public String updateUserInfo(
            @ModelAttribute("user") User user,
            @ModelAttribute("newPassword") String newPassword,
            Model model
    ) throws Exception {
        User currentUser = userService.findById(user.getId());

        if (currentUser == null) {
            throw new Exception("User not found");
        }

        /*check email already exists*/
        if (userService.findByEmail(user.getEmail()) != null) {
            if (!Objects.equals(userService.findByEmail(user.getEmail()).getId(), currentUser.getId())) {
                model.addAttribute("emailExists", true);
                return "myProfile";
            }
        }

        /*check username already exists*/
        if (userService.findByUsername(user.getUsername()) != null) {
            if (!Objects.equals(userService.findByUsername(user.getUsername()).getId(), currentUser.getId())) {
                model.addAttribute("usernameExists", true);
                return "myProfile";
            }
        }

//		update password
        if (newPassword != null && !newPassword.isEmpty() && !newPassword.equals("")) {
            BCryptPasswordEncoder passwordEncoder = SecurityUtility.passwordEncoder();
            String dbPassword = currentUser.getPassword();
            if (passwordEncoder.matches(user.getPassword(), dbPassword)) {
                currentUser.setPassword(passwordEncoder.encode(newPassword));
            } else {
                model.addAttribute("incorrectPassword", true);

                return "myProfile";
            }
        }

        currentUser.setFirstName(user.getFirstName());
        currentUser.setLastName(user.getLastName());
        currentUser.setUsername(user.getUsername());
        currentUser.setEmail(user.getEmail());

        userService.save(currentUser);

        model.addAttribute("updateSuccess", true);
        model.addAttribute("user", currentUser);
        model.addAttribute("classActiveEdit", true);
        model.addAttribute("orderList", currentUser.getOrderList());
        model.addAttribute("listOfShippingAddresses", true);

        UserDetails userDetails = userSecurityService.loadUserByUsername(currentUser.getUsername());

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, userDetails.getPassword(),
                userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return "myProfile";
    }

    @RequestMapping("/login")
    public String login(Model model) {
        model.addAttribute("classActiveLogin", true);
        return "myAccount";
    }


    @RequestMapping("/bookshelf")
    public String bookshelf(Model model, Principal principal) {
        if (principal != null) {
            String username = principal.getName();
            User user = userService.findByUsername(username);
            model.addAttribute("user", user);
        }

        List<Book> bookList = bookService.findAll();
        model.addAttribute("bookList", bookList);
        model.addAttribute("activeAll", true);

        return "bookshelf";
    }

    @RequestMapping("/bookDetail")
    public String bookDetail(@PathParam("id") Long id, Model model, Principal principal) {

        if (principal != null) {
            String username = principal.getName();
            User user = userService.findByUsername(username);
            model.addAttribute("user", user);

        }
        Book book = bookService.findById(id).orElse(null);
        model.addAttribute("book", book);
        List<Integer> qtyList = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        model.addAttribute("qtyList", qtyList);
        model.addAttribute("qty", 1);

        return "bookDetail";
    }


    @RequestMapping(value = "/newAccount", method = RequestMethod.POST)
    public String newUserPost(
            HttpServletRequest request,
            @ModelAttribute("email") String userEmail,
            @ModelAttribute("username") String username,
            Model model) throws Exception {
        model.addAttribute("classActiveNewAccount", true);
        model.addAttribute("email", userEmail);
        model.addAttribute("username", username);

        if (userService.findByUsername(username) != null) {
            model.addAttribute("userNameExists", true);

            return "myAccount";
        }

        if (userService.findByEmail(userEmail) != null) {
            model.addAttribute("emailExists", true);

            return "myAccount";
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(userEmail);
        user.setBalance(100.00);

        String password = SecurityUtility.randomPassword();

        String encryptedPassword = SecurityUtility.passwordEncoder().encode(password);
        user.setPassword(encryptedPassword);

        Role role = new Role();
        role.setRoleId(1);
        role.setName("ROLE_USER");
        Set<UserRole> userRoles = new HashSet<>();
        userRoles.add(new UserRole(user, role));
        userService.createUser(user, userRoles);

        String token = UUID.randomUUID().toString();
        userService.createPasswordResetTokenForUser(user, token);

        String appUrl = "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();

        SimpleMailMessage email = mailConstructor.constructResetTokenEmail(appUrl, request.getLocale(), token, user, password);
        mailSender.send(email);

        model.addAttribute("emailSent", "true");
        model.addAttribute("orderList", user.getOrderList());

        return "myAccount";
    }

    @RequestMapping("/newAccount")
    public String newAccount(Locale locale, @RequestParam("token") String token, Model model) {
        PasswordResetToken passToken = userService.getPasswordResetToken(token);

        if (passToken == null) {
            String message = "Invalid Token.";
            model.addAttribute("message", message);
            return "redirect:/badRequest";
        }

        User user = passToken.getUser();
        String username = user.getUsername();

        UserDetails userDetails = userSecurityService.loadUserByUsername(username);

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, userDetails.getPassword(),
                userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        model.addAttribute("user", user);
        model.addAttribute("classActiveEdit", true);

        return "myProfile";
    }

    @RequestMapping("/forgetPassword")
    public String forgetPassword(
            HttpServletRequest request,
            @ModelAttribute("email") String email,
            Model model
    ) {
        model.addAttribute("classActiveForgetPassword", true);
        User user = userService.findByEmail(email);

        if (user == null) {
            model.addAttribute("emailNotExist", true);
            return "myAccount";
        }

        String password = SecurityUtility.randomPassword();

        String encryptedPassword = SecurityUtility.passwordEncoder().encode(password);
        user.setPassword(encryptedPassword);
        userService.save(user);

        String token = UUID.randomUUID().toString();
        userService.createPasswordResetTokenForUser(user, token);

        String appUrl = "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
        SimpleMailMessage newEmail = mailConstructor.constructResetTokenEmail(appUrl, request.getLocale(), token, user, password);
        mailSender.send(newEmail);

        model.addAttribute("forgetPasswordEmailSent", "true");
        return "myAccount";
    }

    @RequestMapping(value = "/removeUser", method = RequestMethod.POST)
    public String remove(
            @ModelAttribute("id") String id, Model model
    ) {
        userService.removeOne(Long.parseLong(id.substring(9)));
        return "redirect:/logout";
    }

}
