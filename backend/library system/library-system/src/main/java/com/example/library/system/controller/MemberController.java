package com.example.library.system.controller;

import com.example.library.system.entity.Member;
import com.example.library.system.service.MemberService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping
    public ResponseEntity<Member> addMember(
            @RequestBody Member member) {

        return ResponseEntity.ok(
                memberService.addMember(member)
        );
    }

    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {

        return ResponseEntity.ok(
                memberService.getAllMembers()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                memberService.getMemberById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(
            @PathVariable Long id,
            @RequestBody Member member) {

        return ResponseEntity.ok(
                memberService.updateMember(id, member)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMember(
            @PathVariable Long id) {

        memberService.deleteMember(id);

        return ResponseEntity.ok(
                "Member deleted successfully"
        );
    }

    @PostMapping("/login")
    public ResponseEntity<Member> login(
            @RequestBody Map<String, String> loginData) {

        String email = loginData.get("email");
        String password = loginData.get("password");

        return ResponseEntity.ok(
                memberService.login(email, password)
        );
    }
}