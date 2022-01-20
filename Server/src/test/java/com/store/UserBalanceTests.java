package com.store;

import com.store.Domain.BalanceRequest;
import com.store.Domain.User;
import com.store.Service.BalanceService;
import com.store.Service.UserService;
import org.junit.jupiter.api.*;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Collections;
import java.util.Optional;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserBalanceTests {

    @Mock
    private BalanceService balanceService;

    @Mock
    private UserService userService;

    private static User user = new User();
    static BalanceRequest balanceRequest = new BalanceRequest();

    @BeforeAll
    static void createUser() {
        user.setUsername("DAMI");
        user.setEmail("dami45@gma1l.com");
    }

    @Test
    @Order(1)
    void saveUser() {
        Mockito.when(userService.save(user)).thenReturn(user);
    }


    @Test
    @Order(2)
    void addNewBalanceRequest() {
        balanceRequest.setUser(user);
        balanceRequest.setSumToAdd(69);

        Mockito.when(balanceService.save(balanceRequest)).thenReturn(balanceRequest);
    }

    @Test
    @Order(3)
    void findBalanceByUser() {
        BalanceRequest balanceRequest1 = new BalanceRequest();
        Mockito.when(balanceService.findByUser(user)).thenReturn(Collections.singletonList(balanceRequest1));
    }

    @Test
    @Order(4)
    void findBalanceService() {
        Optional<BalanceRequest> balanceRequest1 = balanceService.findById(balanceRequest.getId());

        balanceRequest1.ifPresent(request -> Assertions.assertEquals(request.getSumToAdd(), balanceRequest.getSumToAdd()));
    }

    @Test
    @Order(5)
    void deleteBalance() {
        balanceService.removeRequest(balanceRequest.getId());
        Mockito.when(userService.findByUsername(user.getUsername())).thenReturn(user);
        userService.removeOne(user.getId());
    }


}
