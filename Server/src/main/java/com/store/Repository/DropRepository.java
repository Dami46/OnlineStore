package com.store.Repository;

import com.store.Domain.DropItem;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface DropRepository  extends CrudRepository<DropItem, Long> {
}
