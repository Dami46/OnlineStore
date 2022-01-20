package com.store;

import com.store.Domain.Book;
import com.store.Service.BookService;
import org.junit.jupiter.api.*;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.verify;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class BookTests {

    @Mock
    private BookService bookService;

    static Book book = new Book();

    @BeforeAll
    static void createBook() {
        book.setTitle("TestBook");
        book.setCategory("Action");
    }

    @Test
    @Order(1)
    void saveBook() {
        bookService.save(book);
    }

    @Test
    @Order(2)
    void findBookById() {
        Optional<Book> book2 = bookService.findById(book.getId());

        book2.ifPresent(value -> Assertions.assertEquals(value.getTitle(), book.getTitle()));
    }

    @Test
    public void testFindAll() {
        List<Book> all = new ArrayList();
        all.add(new Book(1L, "TestBook", "Action"));
        all.add(new Book(1L, "TestBook2", "Fantasy"));

        Mockito.when(bookService.findAll()).thenReturn(all);
        List<Book> result = bookService.findAll();

        verify(bookService).findAll();
    }

    @Test
    public void testMockedBook() {
        Mockito.when(bookService.findById(1L)).thenReturn(Optional.of(new Book(1L, "TestBook", "Action")));

        Optional<Book> found = bookService.findById(1L);
        found.ifPresent(value -> Assertions.assertEquals("TestBook", value.getTitle()));
    }

    @Test
    void deleteBook() {
        bookService.remove(book);
    }


}
