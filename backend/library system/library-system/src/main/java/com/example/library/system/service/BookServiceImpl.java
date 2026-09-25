package com.example.library.system.service;

import com.example.library.system.entity.Book;
import com.example.library.system.exception.BadRequestException;
import com.example.library.system.exception.ResourceNotFoundException;
import com.example.library.system.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public Book addBook(Book book) {

        if (book.getQuantity() < 0) {
            throw new BadRequestException("Quantity cannot be negative");
        }

        book.setAvailableQuantity(book.getQuantity());

        return bookRepository.save(book);
    }

    @Override
    public Book updateBook(Long id, Book book) {

        Book existingBook = getBookById(id);

        existingBook.setBookName(book.getBookName());
        existingBook.setAuthor(book.getAuthor());
        existingBook.setCategory(book.getCategory());
        existingBook.setIsbn(book.getIsbn());

        int issuedBooks =
                existingBook.getQuantity()
                - existingBook.getAvailableQuantity();

        if (book.getQuantity() < issuedBooks) {
            throw new BadRequestException(
                    "Quantity cannot be less than currently issued books"
            );
        }

        existingBook.setQuantity(book.getQuantity());
        existingBook.setAvailableQuantity(
                book.getQuantity() - issuedBooks
        );

        return bookRepository.save(existingBook);
    }

    @Override
    public Book getBookById(Long id) {

        return bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Book not found with id: " + id
                        ));
    }

    @Override
    public List<Book> getAllBooks() {

        return bookRepository.findAll();
    }

    @Override
    public void deleteBook(Long id) {

        Book book = getBookById(id);

        bookRepository.delete(book);
    }

    @Override
    public List<Book> searchBooks(String keyword) {

        List<Book> result = new ArrayList<>();

        result.addAll(
                bookRepository
                        .findByBookNameContainingIgnoreCase(keyword)
        );

        result.addAll(
                bookRepository
                        .findByAuthorContainingIgnoreCase(keyword)
        );

        result.addAll(
                bookRepository
                        .findByCategoryContainingIgnoreCase(keyword)
        );

        result.addAll(
                bookRepository
                        .findByIsbnContainingIgnoreCase(keyword)
        );

        return result.stream().distinct().toList();
    }

    @Override
    public List<Book> getAvailableBooks() {

        return bookRepository.findByAvailableQuantityGreaterThan(0);
    }
}