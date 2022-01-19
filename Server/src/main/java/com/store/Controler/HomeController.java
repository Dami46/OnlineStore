package com.store.Controler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.Domain.*;
import com.store.Dto.*;
import com.store.Security.PasswordResetToken;
import com.store.Security.Role;
import com.store.Security.UserRole;
import com.store.Service.*;
import com.store.Service.Impl.UserSecurityService;
import com.store.Utility.JwtUtil;
import com.store.Utility.MailConstructor;
import com.store.Utility.SecurityUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.websocket.server.PathParam;
import java.io.IOException;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

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

    @Autowired
    private JwtUtil jwtUtil;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @RequestMapping("/")
    public ResponseEntity<?> index() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/myProfile")
    public ResponseEntity<Model> myAccount(@PathParam("token") String token, Model model) {

        String userName = jwtUtil.parseToken(token);
        User user = userService.findByUsername(userName);
        model.addAttribute("user", user);
        model.addAttribute("userShippingList", user.getUserShippingList());
        model.addAttribute("orderList", user.getOrderList());
        UserShipping userShipping = new UserShipping();

        model.addAttribute("userShipping", userShipping);
        model.addAttribute("listOfShippingAddresses", true);
        model.addAttribute("classActiveEdit", true);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "listOfShippingAddresses")
    public ResponseEntity<Model> listOfShippingAddresses(@PathParam("token") String token, Model model) {

        String userName = jwtUtil.parseToken(token);
        User user = userService.findByUsername(userName);

        List<UserShipping> userShippingList = user.getUserShippingList();
        if (userShippingList.isEmpty()) {
            model.addAttribute("emptyList", true);
        } else {
            model.addAttribute("emptyList", false);
        }

        model.addAttribute("user", user);
        model.addAttribute("userShippingList", user.getUserShippingList());
        model.addAttribute("orderList", user.getOrderList());

        model.addAttribute("classActiveShipping", true);
        model.addAttribute("listOfShippingAddresses", true);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "orderDetail")
    public ResponseEntity<Model> orderDetail(@RequestParam("id") Long orderId, @RequestParam("token") String token, Model model) {

        String userName = jwtUtil.parseToken(token);

        User user = userService.findByUsername(userName);
        Order order = orderService.findOne(orderId);
        Book book = new Book();

        if (Objects.nonNull(order.getBookId())) {
            book = bookService.findById(order.getBookId()).orElse(null);
            model.addAttribute("singleBook", true);
        } else {
            model.addAttribute("singleBook", false);
        }

        if (!order.getUser().getId().equals(user.getId())) {
            return new ResponseEntity<>(model, HttpStatus.UNAUTHORIZED);
        } else {
            List<CartItem> cartItemList = cartItemService.findByOrder(order);
            model.addAttribute("cartItemList", cartItemList);
            model.addAttribute("order", order);
            model.addAttribute("boughtBook", book);

            return new ResponseEntity<>(model, HttpStatus.OK);
        }
    }

    @RequestMapping(value = "addNewShippingAddress")
    public ResponseEntity<Model> addNewShippingAddress(@PathParam("token") String token, Model model) {

        String userName = jwtUtil.parseToken(token);
        User user = userService.findByUsername(userName);
        model.addAttribute("user", user);

        model.addAttribute("addNewShippingAddress", true);
        model.addAttribute("classActiveShipping", true);

        UserShipping userShipping = new UserShipping();

        model.addAttribute("userShipping", userShipping);

        model.addAttribute("userShippingList", user.getUserShippingList());
        model.addAttribute("orderList", user.getOrderList());

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "addNewShippingAddress", method = RequestMethod.POST)
    public ResponseEntity<Model> addNewShippingAddressPost(HttpServletRequest request, Model model) throws IOException {

        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        UserShippingAddressDto userShipping = objectMapper.readValue(requestBody, UserShippingAddressDto.class);

        String userName = jwtUtil.parseToken(userShipping.getToken());
        User user = userService.findByUsername(userName);

        UserShipping shipping = userShipping.userShippingDtoToUserShipping(userShipping);

        userService.updateUserShipping(shipping, user);

        model.addAttribute("user", user);
        model.addAttribute("userShippingList", user.getUserShippingList());
        model.addAttribute("listOfShippingAddresses", true);
        model.addAttribute("classActiveShipping", true);
        model.addAttribute("orderList", user.getOrderList());

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "updateUserShipping", method = RequestMethod.PUT)
    public ResponseEntity<Model> updateUserShipping(HttpServletRequest request, Model model) throws IOException {

        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        UserShippingAddressDto userShipping = objectMapper.readValue(requestBody, UserShippingAddressDto.class);

        String userName = jwtUtil.parseToken(userShipping.getToken());
        User user = userService.findByUsername(userName);

        UserShipping shipping = userShippingService.findById(userShipping.getId());

        if (!user.getId().equals(shipping.getUser().getId())) {
            return new ResponseEntity<>(model, HttpStatus.BAD_REQUEST);
        } else {
            shipping = userShipping.userShippingDtoToUserShipping(userShipping);
            model.addAttribute("user", user);
            model.addAttribute("userShipping", shipping);

            userService.updateShippingAddress(shipping, user);

            model.addAttribute("classActiveShipping", true);
            model.addAttribute("userShippingList", user.getUserShippingList());
            model.addAttribute("orderList", user.getOrderList());

            return new ResponseEntity<>(model, HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/setDefaultShippingAddress", method = RequestMethod.POST)
    public ResponseEntity<Model> setDefaultShippingAddress(HttpServletRequest request, Model model) throws IOException {

        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        DefaultShippingAddressDto userShipping = objectMapper.readValue(requestBody, DefaultShippingAddressDto.class);

        String userName = jwtUtil.parseToken(userShipping.getToken());
        User user = userService.findByUsername(userName);
        userService.setUserDefaultShipping(userShipping.getId(), user);

        model.addAttribute("user", user);

        model.addAttribute("classActiveShipping", true);
        model.addAttribute("listOfShippingAddresses", true);

        model.addAttribute("userShippingList", user.getUserShippingList());
        model.addAttribute("orderList", user.getOrderList());

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "removeUserShipping", method = RequestMethod.DELETE)
    public ResponseEntity<Model> removeUserShipping(HttpServletRequest request, Model model) throws IOException {

        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        DefaultShippingAddressDto userShipping = objectMapper.readValue(requestBody, DefaultShippingAddressDto.class);

        String userName = jwtUtil.parseToken(userShipping.getToken());
        User user = userService.findByUsername(userName);
        UserShipping shipping = userShippingService.findById(userShipping.getId());

        if (!Objects.equals(user.getId(), shipping.getUser().getId())) {
            model.addAttribute("emptyList", true);
        } else {
            model.addAttribute("user", user);

            userShippingService.removeById(userShipping.getId());

            model.addAttribute("listOfShippingAddresses", true);
            model.addAttribute("classActiveShipping", true);


            model.addAttribute("userShippingList", user.getUserShippingList());
            model.addAttribute("orderList", user.getOrderList());

        }
        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "/updateUserInfo", method = RequestMethod.POST)
    public ResponseEntity<Model> updateUserInfo(HttpServletRequest request, Model model) throws Exception {

        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

        UserUpdateInfoDto userUpdateInfoDto = objectMapper.readValue(requestBody, UserUpdateInfoDto.class);

        User currentUser = userService.findById(userUpdateInfoDto.getId());

        if (currentUser == null) {
            throw new Exception("User not found");
        }
        //check current password
        if (Objects.nonNull(userUpdateInfoDto.getPassword())) {
            BCryptPasswordEncoder passwordEncoder = SecurityUtility.passwordEncoder();
            String dbPassword = currentUser.getPassword();
            if (passwordEncoder.matches(userUpdateInfoDto.getPassword(), dbPassword)) {
                model.addAttribute("incorrectCurrentPassword", false);
            } else {
                model.addAttribute("incorrectCurrentPassword", true);
                return new ResponseEntity<>(model, HttpStatus.NOT_ACCEPTABLE);
            }
        }

        /*check email already exists*/
        if (userService.findByEmail(userUpdateInfoDto.getEmail()) != null) {
            if (!Objects.equals(userService.findByEmail(userUpdateInfoDto.getEmail()).getId(), currentUser.getId())) {
                model.addAttribute("emailExists", true);
                return new ResponseEntity<>(model, HttpStatus.FORBIDDEN);
            }
        }

        /*check username already exists*/
        if (userService.findByUsername(userUpdateInfoDto.getUsername()) != null) {
            if (!Objects.equals(userService.findByUsername(userUpdateInfoDto.getUsername()).getId(), currentUser.getId())) {
                model.addAttribute("usernameExists", true);
                return new ResponseEntity<>(model, HttpStatus.FORBIDDEN);
            }
        }

//		update password
        if (userUpdateInfoDto.getNewPassword() != null && !userUpdateInfoDto.getNewPassword().isEmpty() && !userUpdateInfoDto.getNewPassword().equals("")) {
            BCryptPasswordEncoder passwordEncoder = SecurityUtility.passwordEncoder();
            String dbPassword = currentUser.getPassword();
            if (passwordEncoder.matches(userUpdateInfoDto.getPassword(), dbPassword)) {
                currentUser.setPassword(passwordEncoder.encode(userUpdateInfoDto.getNewPassword()));
            } else {
                model.addAttribute("incorrectPassword", true);

                return new ResponseEntity<>(model, HttpStatus.NOT_ACCEPTABLE);
            }
        }

        currentUser.setFirstName(userUpdateInfoDto.getFirstName());
        currentUser.setLastName(userUpdateInfoDto.getLastName());
        currentUser.setUsername(userUpdateInfoDto.getUsername());
        currentUser.setEmail(userUpdateInfoDto.getEmail());

        userService.save(currentUser);

        model.addAttribute("updateSuccess", true);
        model.addAttribute("user", currentUser);
        model.addAttribute("orderList", currentUser.getOrderList());

        UserDetails userDetails = userSecurityService.loadUserByUsername(currentUser.getUsername());

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, userDetails.getPassword(),
                userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping("/login")
    public ResponseEntity<Model> login(Model model) {
        model.addAttribute("classActiveLogin", true);
        return new ResponseEntity<>(model, HttpStatus.OK);
    }


    @RequestMapping("/bookshelf")
    public ResponseEntity<Model> bookshelf(Model model) {
        List<Book> bookList = bookService.findAll();
        model.addAttribute("bookList", bookList);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping("/bookDetail")
    public ResponseEntity<Model> bookDetail(@PathParam("id") Long id, Model model) {

        Book book = bookService.findById(id).orElse(null);
        model.addAttribute("book", book);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }


    @RequestMapping(value = "/newAccount", method = RequestMethod.POST)
    public ResponseEntity<Model> newUserPost(
            HttpServletRequest request,
            Model model) throws Exception {

        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

        RegistrationDto registrationDto = objectMapper.readValue(requestBody, RegistrationDto.class);

        model.addAttribute("email", registrationDto.getEmail());
        model.addAttribute("username", registrationDto.getUsername());

        if (userService.findByUsername(registrationDto.getUsername()) != null) {
            model.addAttribute("userNameExists", true);

            return new ResponseEntity<>(model, HttpStatus.FORBIDDEN);
        }

        if (userService.findByEmail(registrationDto.getEmail()) != null) {
            model.addAttribute("emailExists", true);

            return new ResponseEntity<>(model, HttpStatus.FORBIDDEN);
        }

        User user = new User();
        user.setUsername(registrationDto.getUsername());
        user.setEmail(registrationDto.getEmail());
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

        String appUrl = "https://dropki.azurewebsites.net";

        mailSender.send(mailConstructor.constructResetTokenEmail(appUrl, true, token, user, password));

        model.addAttribute("emailSent", "true");
        model.addAttribute("orderList", user.getOrderList());

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping("/newAccount")
    public ResponseEntity<Model> newAccount(@RequestParam("token") String token, Model model) {
        PasswordResetToken passToken = userService.getPasswordResetToken(token);

        if (passToken == null) {
            String message = "Invalid Token.";
            model.addAttribute("message", message);
            return new ResponseEntity<>(model, HttpStatus.BAD_REQUEST); //z TEGO OK TRZEBA ZROBIĆ REDIRECT DO /bad request
        }

        User user = passToken.getUser();
        String username = user.getUsername();

        UserDetails userDetails = userSecurityService.loadUserByUsername(username);

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, userDetails.getPassword(),
                userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        model.addAttribute("user", user);
        model.addAttribute("classActiveEdit", true);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping("/forgetPassword")
    public ResponseEntity<Model> forgetPassword(
            HttpServletRequest request,
            Model model
    ) throws IOException {
        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

        RegistrationDto registrationDto = objectMapper.readValue(requestBody, RegistrationDto.class);

        model.addAttribute("classActiveForgetPassword", true);
        User user = userService.findByEmail(registrationDto.getEmail());

        if (user == null) {
            model.addAttribute("emailNotExist", true);
            return new ResponseEntity<>(model, HttpStatus.FORBIDDEN);
        }

        String password = SecurityUtility.randomPassword();

        String encryptedPassword = SecurityUtility.passwordEncoder().encode(password);
        user.setPassword(encryptedPassword);
        userService.save(user);

        String token = UUID.randomUUID().toString();
        userService.createPasswordResetTokenForUser(user, token);

        String appUrl = "https://dropki.azurewebsites.net";
        mailSender.send(mailConstructor.constructResetTokenEmail(appUrl, false, token, user, password));

        model.addAttribute("forgetPasswordEmailSent", "true");
        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    @RequestMapping(value = "/removeUser", method = RequestMethod.POST)
    public ResponseEntity<Model> remove(
            HttpServletRequest request, Model model
    ) throws IOException {

        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

        DeleteUserDto deleteUserDto = objectMapper.readValue(requestBody, DeleteUserDto.class);

        User currentUser = userService.findById(deleteUserDto.getId());

        if (Objects.nonNull(deleteUserDto.getPassword())) {
            BCryptPasswordEncoder passwordEncoder = SecurityUtility.passwordEncoder();
            String dbPassword = currentUser.getPassword();
            if (passwordEncoder.matches(deleteUserDto.getPassword(), dbPassword)) {
                model.addAttribute("incorrectCurrentPassword", false);
            } else {
                model.addAttribute("incorrectCurrentPassword", true);
                return new ResponseEntity<>(model, HttpStatus.NOT_ACCEPTABLE);
            }
        }
        PasswordResetToken passToken = userService.getPasswordResetTokenByUser(currentUser);
        userService.removePasswordToken(passToken.getId());

        userService.removeOne(currentUser.getId());
        return new ResponseEntity<>(model, HttpStatus.OK); //z TEGO OK TRZEBA ZROBIĆ REDIRECT DO /LOGOUT LUB DO GŁÓWNEJ
    }

}
