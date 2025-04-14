package com.example.demo.service.impl;

import com.example.demo.Entity.User;
import com.example.demo.dto.Userdto;
import com.example.demo.repo.UserRepo;
import com.example.demo.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserImpl implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public String addUser(Userdto userdto) {
        User user = new User();
        user.setUserName(userdto.getUserName());
        user.setEmail(userdto.getEmail());
        user.setPassword(passwordEncoder.encode(userdto.getPassword()));
        userRepo.save(user);
        return user.getUserName();
    }

    @Override
    public boolean validateUser(String email, String password) {
        Optional<User> userOptional = userRepo.findByEmail(email);
        if (userOptional.isPresent()) {
            return passwordEncoder.matches(password, userOptional.get().getPassword());
        }
        return false;
    }

    @Override
    public boolean checkIfUserExists(String email) {
        return userRepo.findByEmail(email).isPresent();
    }
}
