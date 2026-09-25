package com.example.library.system.service;

import com.example.library.system.entity.Book;
import com.example.library.system.entity.Issue;
import com.example.library.system.entity.Member;
import com.example.library.system.exception.BadRequestException;
import com.example.library.system.exception.ResourceNotFoundException;
import com.example.library.system.repository.BookRepository;
import com.example.library.system.repository.IssueRepository;
import com.example.library.system.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class IssueServiceImpl implements IssueService {

    private final IssueRepository issueRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;

    public IssueServiceImpl(
            IssueRepository issueRepository,
            BookRepository bookRepository,
            MemberRepository memberRepository) {

        this.issueRepository = issueRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
    }

    @Override
    public Issue issueBook(Long bookId, Long memberId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Book not found"
                        ));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found"
                        ));

        if (book.getAvailableQuantity() <= 0) {
            throw new BadRequestException(
                    "Book is not available"
            );
        }

        book.setAvailableQuantity(
                book.getAvailableQuantity() - 1
        );

        bookRepository.save(book);

        Issue issue = new Issue();

        issue.setBook(book);
        issue.setMember(member);
        issue.setIssueDate(LocalDate.now());
        issue.setDueDate(LocalDate.now().plusDays(14));
        issue.setFine(0);

        return issueRepository.save(issue);
    }

    @Override
    public Issue returnBook(Long issueId) {

        Issue issue = getIssueById(issueId);

        if (issue.getReturnDate() != null) {
            throw new BadRequestException(
                    "Book is already returned"
            );
        }

        LocalDate returnDate = LocalDate.now();

        issue.setReturnDate(returnDate);

        long overdueDays = 0;

        if (returnDate.isAfter(issue.getDueDate())) {

            overdueDays = ChronoUnit.DAYS.between(
                    issue.getDueDate(),
                    returnDate
            );
        }

        double fine = overdueDays * 5.0;

        issue.setFine(fine);

        Book book = issue.getBook();

        book.setAvailableQuantity(
                book.getAvailableQuantity() + 1
        );

        bookRepository.save(book);

        return issueRepository.save(issue);
    }

    @Override
    public Issue getIssueById(Long id) {

        return issueRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Issue record not found"
                        ));
    }

    @Override
    public List<Issue> getAllIssues() {

        return issueRepository.findAll();
    }

    @Override
    public List<Issue> getIssuesByMember(Long memberId) {

        return issueRepository.findByMemberId(memberId);
    }

    @Override
    public List<Issue> getActiveIssues() {

        return issueRepository.findByReturnDateIsNull();
    }

    @Override
    public double calculateFine(Long issueId) {

        Issue issue = getIssueById(issueId);

        LocalDate endDate = issue.getReturnDate();

        if (endDate == null) {
            endDate = LocalDate.now();
        }

        if (!endDate.isAfter(issue.getDueDate())) {
            return 0;
        }

        long overdueDays = ChronoUnit.DAYS.between(
                issue.getDueDate(),
                endDate
        );

        return overdueDays * 5.0;
    }
}