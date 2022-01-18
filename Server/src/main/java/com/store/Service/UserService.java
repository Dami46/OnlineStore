package com.store.Service;


import com.store.Domain.User;
import com.store.Domain.UserShipping;
import com.store.Security.PasswordResetToken;
import com.store.Security.UserRole;

import java.util.Set;

public interface UserService {
    PasswordResetToken getPasswordResetToken(final String token);

    PasswordResetToken getPasswordResetTokenByUser(User user);

    void removePasswordToken(Long id);

    void createPasswordResetTokenForUser(final User user, final String token);

    User findByUsername(String username);

    User findByEmail(String email);

    User findById(Long id);

    User createUser(User user, Set<UserRole> userRoles) throws Exception;

    User save(User user);

    void removeOne(Long id);

    void updateUserShipping(UserShipping userShipping, User user);

    void updateShippingAddress(UserShipping userShipping, User user);

    void setUserDefaultShipping(Long userShippingId, User user);
}
