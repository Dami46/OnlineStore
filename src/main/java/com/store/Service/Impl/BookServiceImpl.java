package com.store.Service.Impl;

import com.store.Domain.Book;
import com.store.Repository.BookRepository;
import com.store.Service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository bookRepository;

    @Override
    public List<Book> findAll() {
        return (List<Book>) bookRepository.findAll();
    }
    @Override
    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }
}
