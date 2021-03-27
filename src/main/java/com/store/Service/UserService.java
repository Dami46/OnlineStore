package com.store.Service;


import com.store.Domain.User;
import com.store.Security.PasswordResetToken;
import com.store.Security.UserRole;

import java.util.Set;

public interface UserService {
	PasswordResetToken getPasswordResetToken(final String token);

	void createPasswordResetTokenForUser(final User user, final String token);
	
	User findByUsername(String username);
	
	User findByEmail (String email);

	User findById(Long id);

	User createUser(User user, Set<UserRole> userRoles) throws Exception;

	User save(User user);

	void removeOne(Long id);

}
