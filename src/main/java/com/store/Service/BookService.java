package com.store.Service;

import com.store.Domain.Book;

import java.util.List;
import java.util.Optional;

public interface BookService {

    List<Book> findAll();

    Optional<Book> findById(Long id);

    Book save(Book book);

    List<Book> findByCategory(String category);

    List<Book> blurrySearch(String title);
}
