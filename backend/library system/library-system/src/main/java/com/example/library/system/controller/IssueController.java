package com.example.library.system.controller;

import com.example.library.system.entity.Issue;
import com.example.library.system.service.IssueService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "*")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @PostMapping("/issue")
    public ResponseEntity<Issue> issueBook(
            @RequestBody Map<String, Long> data) {

        Long bookId = data.get("bookId");
        Long memberId = data.get("memberId");

        return ResponseEntity.ok(
                issueService.issueBook(bookId, memberId)
        );
    }

    @PutMapping("/return/{id}")
    public ResponseEntity<Issue> returnBook(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                issueService.returnBook(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<Issue>> getAllIssues() {

        return ResponseEntity.ok(
                issueService.getAllIssues()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Issue> getIssueById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                issueService.getIssueById(id)
        );
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Issue>> getIssuesByMember(
            @PathVariable Long memberId) {

        return ResponseEntity.ok(
                issueService.getIssuesByMember(memberId)
        );
    }

    @GetMapping("/active")
    public ResponseEntity<List<Issue>> getActiveIssues() {

        return ResponseEntity.ok(
                issueService.getActiveIssues()
        );
    }

    @GetMapping("/{id}/fine")
    public ResponseEntity<Double> calculateFine(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                issueService.calculateFine(id)
        );
    }
}