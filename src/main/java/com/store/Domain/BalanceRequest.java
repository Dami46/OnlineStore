package com.store.Domain;

import javax.persistence.*;

@Entity
public class BalanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(cascade=CascadeType.ALL,  fetch = FetchType.EAGER)
    @JoinColumn(name="user_id")
    private User user;

    private double sumToAdd;


    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double getSumToAdd() {
        return sumToAdd;
    }

    public void setSumToAdd(double sumToAdd) {
        this.sumToAdd = sumToAdd;
    }
}
