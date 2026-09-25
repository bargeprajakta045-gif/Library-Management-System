package com.example.library.system.service;

import com.example.library.system.entity.Member;
import com.example.library.system.exception.BadRequestException;
import com.example.library.system.exception.ResourceNotFoundException;
import com.example.library.system.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    public MemberServiceImpl(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public Member addMember(Member member) {

        if (memberRepository.findByEmail(member.getEmail()).isPresent()) {
            throw new BadRequestException(
                    "Email already registered"
            );
        }

        return memberRepository.save(member);
    }

    @Override
    public Member updateMember(Long id, Member member) {

        Member existingMember = getMemberById(id);

        existingMember.setName(member.getName());
        existingMember.setEmail(member.getEmail());
        existingMember.setPhone(member.getPhone());
        existingMember.setAddress(member.getAddress());

        if (member.getPassword() != null &&
                !member.getPassword().isBlank()) {

            existingMember.setPassword(member.getPassword());
        }

        return memberRepository.save(existingMember);
    }

    @Override
    public Member getMemberById(Long id) {

        return memberRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found with id: " + id
                        ));
    }

    @Override
    public List<Member> getAllMembers() {

        return memberRepository.findAll();
    }

    @Override
    public void deleteMember(Long id) {

        Member member = getMemberById(id);

        memberRepository.delete(member);
    }

    @Override
    public Member login(String email, String password) {

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found"
                        ));

        if (!member.getPassword().equals(password)) {
            throw new BadRequestException(
                    "Invalid email or password"
            );
        }

        return member;
    }
}