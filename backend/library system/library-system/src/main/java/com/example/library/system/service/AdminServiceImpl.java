package com.example.library.system.service;

import com.example.library.system.entity.Admin;
import com.example.library.system.exception.BadRequestException;
import com.example.library.system.exception.ResourceNotFoundException;
import com.example.library.system.repository.AdminRepository;
import com.example.library.system.service.AdminService;

import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    public AdminServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public Admin login(String username, String password) {

        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Admin username not found"
                        ));

        if (!admin.getPassword().equals(password)) {

            throw new BadRequestException(
                    "Invalid username or password"
            );
        }

        return admin;
    }
}