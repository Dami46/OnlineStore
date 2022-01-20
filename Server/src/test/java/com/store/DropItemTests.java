package com.store;

import com.store.Domain.DropItem;
import com.store.Domain.User;
import com.store.Service.DropService;
import com.store.Service.UserService;
import org.junit.jupiter.api.*;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class DropItemTests {

    @Mock
    private DropService dropService;

    @Mock
    private UserService userService;

    @Mock
    static DropItem dropItem = new DropItem();
    @Mock
    static User user = new User();
    @Mock
    static User user2 = new User();

    @BeforeAll
    static void prepareTests() {
        dropItem.setDropTitle("DropTitle");
        user.setUsername("Dami");
        user.setEmail("dami46@gmail2.com");

        user2.setUsername("user2");
        user2.setEmail("user2@gmail2.com");
    }

    @Test
    @Order(1)
    void saveTestObjects() {
        Mockito.when(dropService.save(Mockito.any(DropItem.class))).thenReturn(dropItem);
        Mockito.when(userService.save(Mockito.any(User.class))).thenReturn(user);
        Mockito.when(userService.save(Mockito.any(User.class))).thenReturn(user2);
    }

    @Test
    @Order(2)
    void signForDropTest() {
        Mockito.when(dropService.signForDrop(dropItem,user2)).thenReturn(true);
        Mockito.when(dropService.signForDrop(dropItem,user)).thenReturn(true);
        Mockito.when(dropService.signForDrop(dropItem,user)).thenReturn(true);
    }

}
