package com.store.Domain;

import javax.persistence.*;
import java.util.List;

@Entity
public class DropItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String dropTitle;
    private String rollDate;
    private String signingDate;
    private Long bookId;
    private boolean wasStarted=false;
    private boolean wasRolled=false;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "dropItem")
    private Book book;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "dropItem")
    private List<UserToDrop> userToDropList;

    public DropItem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getDropTitle() {
        return dropTitle;
    }

    public void setDropTitle(String dropTitle) {
        this.dropTitle = dropTitle;
    }

    public boolean isWasStarted() {
        return wasStarted;
    }

    public void setWasStarted(boolean wasStarted) {
        this.wasStarted = wasStarted;
    }

    public List<UserToDrop> getUserToDropList() {
        return userToDropList;
    }

    public void setUserToDropList(List<UserToDrop> userToDropList) {
        this.userToDropList = userToDropList;
    }

    public String getSigningDate() {
        return signingDate;
    }

    public void setSigningDate(String signingDate) {
        this.signingDate = signingDate;
    }

    public String getRollDate() {
        return rollDate;
    }

    public void setRollDate(String rollDate) {
        this.rollDate = rollDate;
    }

    public boolean isWasRolled() {
        return wasRolled;
    }

    public void setWasRolled(boolean wasRolled) {
        this.wasRolled = wasRolled;
    }
}
