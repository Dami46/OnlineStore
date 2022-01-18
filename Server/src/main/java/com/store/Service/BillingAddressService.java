package com.store.Service;

import com.store.Domain.BillingAddress;
import com.store.Domain.UserBilling;

public interface BillingAddressService {
	BillingAddress setByUserBilling(UserBilling userBilling, BillingAddress billingAddress);
}
