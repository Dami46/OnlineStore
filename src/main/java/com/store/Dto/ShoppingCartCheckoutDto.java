package com.store.Dto;

import com.store.Domain.BillingAddress;
import com.store.Domain.ShippingAddress;

public class ShoppingCartCheckoutDto {
    private ShippingAddress shippingAddress;
    private BillingAddress billingAddress;
    private Boolean billingSameAsShipping;
    private String shippingMethod;
    private String token;

    public ShippingAddress getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(ShippingAddress shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public BillingAddress getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(BillingAddress billingAddress) {
        this.billingAddress = billingAddress;
    }

    public String getShippingMethod() {
        return shippingMethod;
    }

    public void setShippingMethod(String shippingMethod) {
        this.shippingMethod = shippingMethod;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Boolean getBillingSameAsShipping() {
        return billingSameAsShipping;
    }

    public void setBillingSameAsShipping(Boolean billingSameAsShipping) {
        this.billingSameAsShipping = billingSameAsShipping;
    }
}
