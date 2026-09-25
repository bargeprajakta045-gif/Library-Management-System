package com.example.library.system;

import com.example.library.system.entity.Admin;
import com.example.library.system.repository.AdminRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createDefaultAdmin(
            AdminRepository adminRepository) {

        return args -> {

            if (adminRepository.findByUsername("admin").isEmpty()) {

                Admin admin = new Admin();

                admin.setUsername("admin");
                admin.setPassword("admin123");

                adminRepository.save(admin);

                System.out.println(
                        "Default Admin Created Successfully"
                );
            }
        };
    }
}