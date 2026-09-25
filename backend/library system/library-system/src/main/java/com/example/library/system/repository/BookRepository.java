package com.example.library.system.repository;

import com.example.library.system.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByBookNameContainingIgnoreCase(String bookName);

    List<Book> findByAuthorContainingIgnoreCase(String author);

    List<Book> findByCategoryContainingIgnoreCase(String category);

    List<Book> findByIsbnContainingIgnoreCase(String isbn);

    List<Book> findByAvailableQuantityGreaterThan(int quantity);
}