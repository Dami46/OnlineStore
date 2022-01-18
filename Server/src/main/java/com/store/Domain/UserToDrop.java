package com.store.Domain;

import javax.persistence.*;

@Entity
public class UserToDrop {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "dropItem_id")
    private DropItem dropItem;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DropItem getDropItem() {
        return dropItem;
    }

    public void setDropItem(DropItem dropItem) {
        this.dropItem = dropItem;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
