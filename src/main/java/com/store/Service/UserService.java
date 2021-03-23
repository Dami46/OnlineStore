package com.store.Service;


import com.store.Domain.User;
import com.store.Security.PasswordResetToken;

public interface UserService {
	PasswordResetToken getPasswordResetToken(final String token);

	void createPasswordResetTokenForUser(final User user, final String token);
	
	User findByUsername(String username);
	
	User findByEmail (String email);
}
