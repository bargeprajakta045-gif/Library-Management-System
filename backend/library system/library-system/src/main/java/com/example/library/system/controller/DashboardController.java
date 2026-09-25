package com.example.library.system.controller;

import com.example.library.system.entity.Book;
import com.example.library.system.entity.Issue;
import com.example.library.system.repository.BookRepository;
import com.example.library.system.repository.IssueRepository;
import com.example.library.system.repository.MemberRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final IssueRepository issueRepository;

    public DashboardController(
            BookRepository bookRepository,
            MemberRepository memberRepository,
            IssueRepository issueRepository) {

        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
        this.issueRepository = issueRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {

        List<Book> books = bookRepository.findAll();
        List<Issue> issues = issueRepository.findAll();

        int totalBooks = 0;
        int availableBooks = 0;

        for (Book book : books) {

            totalBooks += book.getQuantity();

            availableBooks += book.getAvailableQuantity();
        }

        long totalMembers = memberRepository.count();

        long issuedBooks = issues.stream()
                .filter(issue -> issue.getReturnDate() == null)
                .count();

        long returnedBooks = issues.stream()
                .filter(issue -> issue.getReturnDate() != null)
                .count();

        double fineCollected = issues.stream()
                .filter(issue -> issue.getReturnDate() != null)
                .mapToDouble(Issue::getFine)
                .sum();

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalBooks", totalBooks);
        stats.put("availableBooks", availableBooks);
        stats.put("issuedBooks", issuedBooks);
        stats.put("returnedBooks", returnedBooks);
        stats.put("totalMembers", totalMembers);
        stats.put("fineCollected", fineCollected);

        return ResponseEntity.ok(stats);
    }
}