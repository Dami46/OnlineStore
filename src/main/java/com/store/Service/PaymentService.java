package com.store.Service;


import com.store.Domain.Payment;
import com.store.Domain.UserPayment;

public interface PaymentService {
	Payment setByUserPayment(UserPayment userPayment, Payment payment);
}
