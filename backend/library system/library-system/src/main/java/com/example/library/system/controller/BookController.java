package com.example.library.system.controller;

import com.example.library.system.entity.Book;
import com.example.library.system.service.BookService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping
    public ResponseEntity<Book> addBook(
            @RequestBody Book book) {

        return ResponseEntity.ok(
                bookService.addBook(book)
        );
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {

        return ResponseEntity.ok(
                bookService.getAllBooks()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookService.getBookById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @PathVariable Long id,
            @RequestBody Book book) {

        return ResponseEntity.ok(
                bookService.updateBook(id, book)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBook(
            @PathVariable Long id) {

        bookService.deleteBook(id);

        return ResponseEntity.ok(
                "Book deleted successfully"
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                bookService.searchBooks(keyword)
        );
    }

    @GetMapping("/available")
    public ResponseEntity<List<Book>> getAvailableBooks() {

        return ResponseEntity.ok(
                bookService.getAvailableBooks()
        );
    }
}