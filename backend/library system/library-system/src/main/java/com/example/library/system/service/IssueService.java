package com.example.library.system.service;

import com.example.library.system.entity.Issue;

import java.util.List;

public interface IssueService {

    Issue issueBook(Long bookId, Long memberId);

    Issue returnBook(Long issueId);

    Issue getIssueById(Long id);

    List<Issue> getAllIssues();

    List<Issue> getIssuesByMember(Long memberId);

    List<Issue> getActiveIssues();

    double calculateFine(Long issueId);
}