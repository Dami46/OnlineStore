package com.store.Repository;

import com.store.Domain.BalanceRequest;
import com.store.Domain.Book;
import com.store.Domain.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BalanceRepository  extends CrudRepository<BalanceRequest, Long> {

    List<BalanceRequest> findByUser(User user);
}
