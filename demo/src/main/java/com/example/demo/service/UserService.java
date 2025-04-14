package com.example.demo.service;

import com.example.demo.dto.Userdto;

public interface UserService {
    String addUser(Userdto userdto);
    boolean validateUser(String username, String password);
    boolean checkIfUserExists(String email);
}
