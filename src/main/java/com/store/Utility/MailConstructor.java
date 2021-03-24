package com.store.Utility;

import com.store.Domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Objects;

@Component
public class MailConstructor {

    @Autowired
    private Environment env;

    public SimpleMailMessage constructResetTokenEmail(String contextPath, Locale locale, String token, User user, String password) {
        String url = contextPath + "/newAccount?token=" + token;
        String message = "\n Please click on this link to verify your email. Your password is : \n" + password;
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(user.getEmail());
        email.setSubject("Online Store - New User");
        email.setText(url + message);
        email.setFrom(Objects.requireNonNull(env.getProperty("support.email")));
        return email;
    }
}
