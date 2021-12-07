package com.store.Service.Impl;

import com.store.Domain.DropItem;
import com.store.Domain.User;
import com.store.Domain.UserToDrop;
import com.store.Repository.DropRepository;
import com.store.Repository.UserToItemRepository;
import com.store.Service.DropService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class DropServiceImpl implements DropService {

    @Autowired
    private DropRepository dropRepository;

    @Autowired
    private UserToItemRepository userToItemRepository;

    @Override
    public boolean signForDrop(DropItem dropItem, User user) {

        if (checkIfUserIsInDrop(user, dropItem)) {
            return false;
        }
        UserToDrop userToDrop = new UserToDrop();
        userToDrop.setDropItem(dropItem);
        userToDrop.setUser(user);
        userToItemRepository.save(userToDrop);
        return true;
    }

    @Override
    public void signOutFromDrop(User user, DropItem dropItem) {
        userToItemRepository.deleteByUserAndDropItem(user, dropItem);
    }

    @Override
    public List<DropItem> findAll() {
        return (List<DropItem>) dropRepository.findAll();
    }

    @Override
    public Optional<DropItem> findById(Long id) {
        return dropRepository.findById(id);
    }

    @Override
    public DropItem save(DropItem dropItem) {
        return dropRepository.save(dropItem);
    }

    @Override
    public boolean checkIfUserIsInDrop(User user, DropItem dropItem) {
        List<UserToDrop> usersToDrops = userToItemRepository.findAllByDropItem(dropItem);

        for (UserToDrop userToDrop : usersToDrops) {
            if (user.getId().equals(userToDrop.getUser().getId()) && Objects.equals(userToDrop.getDropItem().getId(), dropItem.getId())) {
                return true;
            }
        }
        return false;
    }

    @Override
    public int checkUserPlaceInDrop(User user, DropItem dropItem) {
        List<UserToDrop> usersToDrops = userToItemRepository.findAllByDropItem(dropItem);
        int index = 0;
        for (UserToDrop userToDrop : usersToDrops) {
            index++;
            if (user.getId().equals(userToDrop.getUser().getId()) && Objects.equals(userToDrop.getDropItem().getId(), dropItem.getId())) {
                return index;
            }
        }
        return 0;
    }
}
