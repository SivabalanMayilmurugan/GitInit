package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.demo.dto.Userdto;
import com.example.demo.repo.UserRepo;
import com.example.demo.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Adjust port as needed
@RequestMapping("api/v1/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/save")
    public ResponseEntity<String> saveUser(@RequestBody Userdto userDTO) {
        if (userService.checkIfUserExists(userDTO.getEmail())) {
            return ResponseEntity.badRequest().body("User already exists");
        }

        String username = userService.addUser(userDTO);
        return ResponseEntity.ok("User registered successfully: " + username);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Userdto userDTO) {
        System.out.println("Incoming email: " + userDTO.getEmail()); // Add this
        System.out.println("Incoming password: " + userDTO.getPassword());

        boolean isValid = userService.validateUser(userDTO.getEmail(), userDTO.getPassword());

        if (isValid) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

}
