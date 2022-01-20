package com.store.Service.Impl;

import com.store.Domain.Book;
import com.store.Repository.BookRepository;
import com.store.Service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository bookRepository;

    @Override
    public List<Book> findAll() {
        List<Book> bookList = (List<Book>) bookRepository.findAll();
        List<Book> activeBookList = new ArrayList<>();

        for (Book book: bookList) {
            if(book.isActive() && !book.isBookToDrop()) {
                activeBookList.add(book);
            }
        }

        return activeBookList;
    }
    @Override
    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }

    @Override
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public void remove(Book book) {
        bookRepository.delete(book);
    }

    @Override
    public List<Book> findByCategory(String category){
        List<Book> bookList = bookRepository.findByCategory(category);

        List<Book> activeBookList = new ArrayList<>();

        for (Book book: bookList) {
            if(book.isActive() && !book.isBookToDrop()) {
                activeBookList.add(book);
            }
        }

        return activeBookList;
    }

    @Override
    public List<Book> blurrySearch(String title) {
        List<Book> bookList = bookRepository.findByTitleContaining(title);
        List<Book> activeBookList = new ArrayList<>();

        for (Book book: bookList) {
            if(book.isActive() && !book.isBookToDrop()) {
                activeBookList.add(book);
            }
        }

        return activeBookList;
    }
}
