package com.store.Service;

import com.store.Domain.User;
import com.store.Repository.PasswordResetTokenRepository;
import com.store.Repository.UserRepository;
import com.store.Security.PasswordResetToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class UserServiceImpl implements UserService{
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;
	
	@Override
	public PasswordResetToken getPasswordResetToken(final String token) {
		return passwordResetTokenRepository.findByToken(token);
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
	
	public User findByEmail (String email) {
		return userRepository.findByEmail(email);
	}

}
