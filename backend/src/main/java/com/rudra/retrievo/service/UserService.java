package com.rudra.retrievo.service;

import com.rudra.retrievo.dto.UserLoginDto;
import com.rudra.retrievo.dto.UserRegistrationDto;
import com.rudra.retrievo.entity.User;
import com.rudra.retrievo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService
                       jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User registerNewUser(UserRegistrationDto registrationDto) {
        if(userRepository.findByEmail(registrationDto.getEmail()).isPresent()){
            throw new RuntimeException("Email address is already in use");
        }

        User user = User.builder()
                .fullName(registrationDto.getFullName())
                .email(registrationDto.getEmail())
                .password(passwordEncoder.encode(registrationDto.getPassword()))
                .build();

        return userRepository.save(user);

    }

    public String loginUser(UserLoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if(!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }
        return jwtService.generateToken(user);
    }
}
