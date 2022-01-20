package com.store;

import com.store.Domain.User;
import com.store.Domain.UserShipping;
import com.store.Security.Role;
import com.store.Security.UserRole;
import com.store.Service.UserService;
import com.store.Service.UserShippingService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashSet;
import java.util.Set;

@SpringBootTest
public class UserManagementTests {

    @Autowired
    private UserService userService;

    @Autowired
    private UserShippingService userShippingService;

    static User user = new User();

    @BeforeAll
    static void prepareUserToTest() {
        user.setUsername("TestUser");
        user.setEmail("damiu341@gm1aail.com");
    }

    @Test
    void userFindByUsername() {
        String userName = "Dami46";
        User testUser = userService.findByUsername(userName);

        Assertions.assertEquals(testUser.getUsername(), userName);
    }

    @Test
    void userFindByEmail() {
        String userName = "damiu346@gm1ail.com";
        User testUser = userService.findByEmail(userName);

        Assertions.assertEquals(testUser.getEmail(), userName);
    }

    @Test
    void userFindById() {
        User testUser = userService.findById(104L);

        Assertions.assertEquals(testUser.getId(), 104L);
    }

    @Test
    void userCreate() throws Exception {
        Role role = new Role();
        role.setRoleId(1);
        role.setName("ROLE_USER");
        Set<UserRole> userRoles = new HashSet<>();
        userRoles.add(new UserRole(user, role));
        user = userService.createUser(user, userRoles);
    }

    @Test
    void setUserShippingAddress() {
        UserShipping shippingAddress = new UserShipping();
        shippingAddress.setUserShippingName("userShippingName");
        userService.updateUserShipping(shippingAddress, user);
    }

    @Test
    void setDefaultUserShippingAddress() {
        Long shippingId = user.getUserShippingList().get(0).getId();
        userService.setUserDefaultShipping(shippingId, user);
    }

    @Test
    void removeUserShipping() {
        Long shippingId = user.getUserShippingList().get(0).getId();
        userShippingService.removeById(shippingId);
    }

    @Test
    void deleteUser() {
        userService.removeOne(user.getId());
    }
}
