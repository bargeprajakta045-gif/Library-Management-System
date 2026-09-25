package com.example.library.system.repository;

import com.example.library.system.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByMemberId(Long memberId);

    List<Issue> findByBookId(Long bookId);

    List<Issue> findByReturnDateIsNull();
}