package com.store;

import com.store.Domain.BalanceRequest;
import com.store.Domain.User;
import com.store.Service.BalanceService;
import com.store.Service.UserService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserBalanceTests {

    @Autowired
    private BalanceService balanceService;

    @Autowired
    private UserService userService;

    private static User user = new User();
    static List<BalanceRequest> balanceRequestList;
    static BalanceRequest balanceRequest = new BalanceRequest();

    @BeforeAll
    static void createUser() {
        user.setUsername("DAMI");
        user.setEmail("dami45@gma1l.com");
    }

    @Test
    @Order(1)
    void saveUser() {
        userService.save(user);
    }


    @Test
    @Order(2)
    void addNewBalanceRequest() {
        balanceRequest.setUser(user);
        balanceRequest.setSumToAdd(69);

        balanceService.addBalance(balanceRequest);
    }

    @Test
    @Order(3)
    void findBalanceByUser() {
        balanceRequest = balanceService.findByUser(user).get(0);
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
        user = userService.findByUsername(user.getUsername());
        userService.removeOne(user.getId());
    }


}
