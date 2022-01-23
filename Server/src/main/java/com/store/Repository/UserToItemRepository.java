package com.store.Repository;

import com.store.Domain.DropItem;
import com.store.Domain.User;
import com.store.Domain.UserToDrop;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface UserToItemRepository extends CrudRepository<UserToDrop, Long> {

    void deleteByUserAndDropItem(User user, DropItem dropItem);

    List<UserToDrop> findAllByDropItem(DropItem dropItem);

    void deleteUserToDropByUser(User user);

}
