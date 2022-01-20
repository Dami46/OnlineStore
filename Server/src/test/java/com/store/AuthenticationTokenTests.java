package com.store;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.store.Domain.User;
import com.store.Service.UserService;
import com.store.Utility.JwtUtil;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.*;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthenticationTokenTests {

    @Mock
    private UserService userService;

    @Mock
    private JwtUtil jwtUtil;

    private static final User user = new User();
    private static String token;

    private static final String TOKEN_PREFIX = "Dropki ";


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
    @Order(1)
    void saveUser() {
        userService.save(user);
    }

    @Test
    @Order(2)
    void generateToken() {
        token = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + 3600000))
                .sign(Algorithm.HMAC256("secretForEncodingSignature"));
    }

    @Test
    @Order(3)
    void checkAuthToken() {
        String userName = parseToken(token);
        userService.findByUsername(userName);

        Assertions.assertEquals(user.getUsername(), userName);
    }

    @Test
    @Order(4)
    void deleteUser() {
        userService.removeOne(user.getId());
    }


    private String parseToken(String token) {
        try {
            String getToken = "secretForEncodingSignature";
            return JWT.require(Algorithm.HMAC256(getToken))
                    .build()
                    .verify(token.replace(TOKEN_PREFIX, ""))
                    .getSubject();

        } catch (JwtException | ClassCastException e) {
            return null;
        }
    }
}
