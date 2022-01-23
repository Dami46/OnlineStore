package com.store.Service.Impl;

import com.store.Domain.ShoppingCart;
import com.store.Domain.User;
import com.store.Domain.UserShipping;
import com.store.Repository.PasswordResetTokenRepository;
import com.store.Repository.RoleRepository;
import com.store.Repository.UserRepository;
import com.store.Repository.UserShippingRepository;
import com.store.Security.PasswordResetToken;
import com.store.Security.UserRole;
import com.store.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;


@Service
public class UserServiceImpl implements UserService {

    private static final Logger LOG = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserShippingRepository userShippingRepository;

    @Override
    public PasswordResetToken getPasswordResetToken(final String token) {
        return passwordResetTokenRepository.findByToken(token);
    }

    @Override
    public List<PasswordResetToken> getPasswordResetTokenByUser(User user) {
        return passwordResetTokenRepository.findAllByUser(user);
    }

    @Override
    @Transactional
    public void deleteExpiredTokens() {
        passwordResetTokenRepository.deleteAllExpiredSince(new Date(System.currentTimeMillis()));
    }

    @Override
    public void removePasswordToken(Long id) {
        passwordResetTokenRepository.deleteById(id);
    }

    @Override
    public void createPasswordResetTokenForUser(final User user, final String token) {
        final PasswordResetToken myToken = new PasswordResetToken(token, user);
        passwordResetTokenRepository.save(myToken);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User createUser(User user, Set<UserRole> userRoles) {
        User localUser = userRepository.findByUsername(user.getUsername());

        if (localUser != null) {
            LOG.info("user {} already exists", user.getUsername());
        } else {
            for (UserRole userRole : userRoles) {
                roleRepository.save(userRole.getRole());
            }
            user.getUserRoles().addAll(userRoles);

            ShoppingCart shoppingCart = new ShoppingCart();
            shoppingCart.setUser(user);
            user.setShoppingCart(shoppingCart);

            user.setUserShippingList(new ArrayList<UserShipping>());

            localUser = userRepository.save(user);
        }
        return localUser;
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public void removeOne(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public void updateUserShipping(UserShipping userShipping, User user) {
        checkIfUserHasDefaultShipping(user);

        userShipping.setUser(user);
        userShipping.setUserShippingDefault(true);
        userShippingRepository.save(userShipping);
        user.getUserShippingList().add(userShipping);
        save(user);
    }

    @Override
    public void updateShippingAddress(UserShipping userShipping, User user) {
        userShipping.setUser(user);
        userShippingRepository.save(userShipping);
    }

    @Override
    public void setUserDefaultShipping(Long userShippingId, User user) {
        List<UserShipping> userShippingList = (List<UserShipping>) userShippingRepository.findAll();

        for (UserShipping userShipping : userShippingList) {
            if (Objects.equals(userShipping.getId(), userShippingId)) {
                userShipping.setUserShippingDefault(true);
                userShippingRepository.save(userShipping);
            } else {
                userShipping.setUserShippingDefault(false);
                userShippingRepository.save(userShipping);
            }

        }
    }

    @Override
    public void checkIfUserHasDefaultShipping(User user) {
        List<UserShipping> userShippingList = (List<UserShipping>) userShippingRepository.findAll();

        for (UserShipping userShipping : userShippingList) {
            userShipping.setUserShippingDefault(false);
            userShippingRepository.save(userShipping);
        }
    }
}
