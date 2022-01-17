package com.store.Utility;

import com.store.Domain.Book;
import com.store.Domain.Order;
import com.store.Domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Objects;

@Component
public class MailConstructor {

    @Autowired
    private Environment env;

    @Autowired
    private TemplateEngine templateEngine;

    public MimeMessagePreparator constructResetTokenEmail(String contextPath, boolean isNewAccount, String token, User user, String password) {
        String url = contextPath + "/newAccount?token=" + token;

        Context context = new Context();
        context.setVariable("user", user);
        context.setVariable("password", password);
        context.setVariable("token", token);
        context.setVariable("url", url);
        context.setVariable("isNewAccount", isNewAccount);

        String text = templateEngine.process("constructRequestTokenEmailTemplate", context);

        MimeMessagePreparator messagePreparator = new MimeMessagePreparator() {
            @Override
            public void prepare(MimeMessage mimeMessage) throws Exception {
                MimeMessageHelper email = new MimeMessageHelper(mimeMessage, true);
                email.setTo(user.getEmail());
                email.setSubject("Dropki.pl - Your account management");
                email.setText(text, true);
                email.setFrom(new InternetAddress(Objects.requireNonNull(env.getProperty("support.email"))));
            }
        };
        return messagePreparator;
    }

    public MimeMessagePreparator constructOrderConfirmationEmail(User user, Order order, Book book) {
        Context context = new Context();
        context.setVariable("order", order);
        context.setVariable("book", book);
        context.setVariable("user", user);
        context.setVariable("cartItemList", order.getCartItemList());
        context.setVariable("bookCheckout", true);

        String text = templateEngine.process("orderConfirmationEmailTemplate", context);

        MimeMessagePreparator messagePreparator = new MimeMessagePreparator() {
            @Override
            public void prepare(MimeMessage mimeMessage) throws Exception {
                MimeMessageHelper email = new MimeMessageHelper(mimeMessage);
                email.setTo(user.getEmail());
                email.setSubject("Dropki.pl - Order Confirmation - " + order.getId());
                email.setText(text, true);
                email.setFrom(Objects.requireNonNull(env.getProperty("support.email")));
            }
        };
        return messagePreparator;
    }

    public MimeMessagePreparator constructOrderConfirmationEmail(User user, Order order) {
        Context context = new Context();
        context.setVariable("order", order);
        context.setVariable("user", user);
        context.setVariable("cartItemList", order.getCartItemList());
        context.setVariable("cartCheckout", true);
        context.setVariable("book", new Book());

        String text = templateEngine.process("orderConfirmationEmailTemplate", context);

        MimeMessagePreparator messagePreparator = new MimeMessagePreparator() {
            @Override
            public void prepare(MimeMessage mimeMessage) throws Exception {
                MimeMessageHelper email = new MimeMessageHelper(mimeMessage);
                email.setTo(user.getEmail());
                email.setSubject("Dropki.pl - Order Confirmation - " + order.getId());
                email.setText(text, true);
                email.setFrom(Objects.requireNonNull(env.getProperty("support.email")));
            }
        };
        return messagePreparator;
    }

}
