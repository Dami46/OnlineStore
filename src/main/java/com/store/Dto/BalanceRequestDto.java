package com.store.Dto;

public class BalanceRequestDto {

    private double sumToAdd;
    private String token;

    public double getSumToAdd() {
        return sumToAdd;
    }

    public void setSumToAdd(double sumToAdd) {
        this.sumToAdd = sumToAdd;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
