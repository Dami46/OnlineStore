package com.store;

import com.store.Domain.User;
import com.store.Security.Role;
import com.store.Security.UserRole;
import com.store.Service.UserService;
import com.store.Utility.SecurityUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class OnlineStoreApplication implements CommandLineRunner {

    @Autowired
    private UserService userService;

    public static void main(String[] args) {
        SpringApplication.run(OnlineStoreApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        User user1 = new User();
        user1.setFirstName("Damian");
        user1.setLastName("Patan");
        user1.setUsername("Dami46");
        user1.setPassword(SecurityUtility.passwordEncoder().encode("Damian"));
        user1.setBalance(100);
        user1.setEmail("damiu346@gm1ail.com");
        Set<UserRole> userRoles = new HashSet<>();
        Role role1 = new Role();
        role1.setRoleId(1);
        role1.setName("ROLE_USER");
        userRoles.add(new UserRole(user1, role1));

        userService.createUser(user1, userRoles);
    }
}
