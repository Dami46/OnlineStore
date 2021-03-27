package com.store.Repository;

import com.store.Domain.Book;
import org.springframework.data.repository.CrudRepository;


public interface BookRepository extends CrudRepository<Book, Long> {

}
