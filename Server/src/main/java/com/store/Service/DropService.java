package com.store.Service;

import com.store.Domain.DropItem;
import com.store.Domain.User;

import java.util.List;
import java.util.Optional;

public interface DropService {

    boolean signForDrop(DropItem dropItem, User user);

    void signOutFromDrop(User user, DropItem dropItem);

    void deleteUserToDropByUser(User user);

    List<DropItem> findAll();

    Optional<DropItem> findById(Long id);

    DropItem save(DropItem dropItem);

    boolean checkIfUserIsInDrop(User user, DropItem dropItem);

    int checkUserPlaceInDrop(User user, DropItem dropItem);
}
