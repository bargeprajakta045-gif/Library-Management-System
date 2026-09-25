package com.example.library.system.service;

import com.example.library.system.entity.Admin;

public interface AdminService {

    Admin login(String username, String password);
}