package com.store;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.store.Domain.User;
import com.store.Service.UserService;
import com.store.Utility.JwtUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;

@SpringBootTest
public class AuthenticationTokenTests {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private static User user = new User();
    private static String token;

    @BeforeAll
    static void createUser() {
        user.setUsername("DAMI");
        user.setEmail("dami45@gma1l.com");

        token = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + 3600000))
                .sign(Algorithm.HMAC256("secretForEncodingSignature"));
    }

    @Test
    void saveUser() {
        userService.save(user);
    }

    @Test
    void generateToken() {
        token = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + 3600000))
                .sign(Algorithm.HMAC256("secretForEncodingSignature"));
    }

    @Test
    void checkAuthToken() {
        String userName = jwtUtil.parseToken(token);
        user = userService.findByUsername(userName);

        Assertions.assertEquals(user.getUsername(), userName);
    }

    @Test
    void deleteUser() {
        userService.removeOne(user.getId());
    }

}
