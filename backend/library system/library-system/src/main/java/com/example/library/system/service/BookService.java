package com.example.library.system.service;

import com.example.library.system.entity.Book;

import java.util.List;

public interface BookService {

    Book addBook(Book book);

    Book updateBook(Long id, Book book);

    Book getBookById(Long id);

    List<Book> getAllBooks();

    void deleteBook(Long id);

    List<Book> searchBooks(String keyword);

    List<Book> getAvailableBooks();
}