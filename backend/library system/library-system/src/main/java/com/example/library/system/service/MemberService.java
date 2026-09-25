package com.example.library.system.service;

import com.example.library.system.entity.Member;

import java.util.List;

public interface MemberService {

    Member addMember(Member member);

    Member updateMember(Long id, Member member);

    Member getMemberById(Long id);

    List<Member> getAllMembers();

    void deleteMember(Long id);

    Member login(String email, String password);
}