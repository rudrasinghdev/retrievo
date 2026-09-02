package com.rudra.retrievo.service;

import com.rudra.retrievo.dto.UserLoginDto;
import com.rudra.retrievo.dto.UserProfileUpdateDto;
import com.rudra.retrievo.dto.UserRegistrationDto;
import com.rudra.retrievo.entity.User;
import com.rudra.retrievo.exception.EmailAlreadyExistsException;
import com.rudra.retrievo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public User registerNewUser(UserRegistrationDto registrationDto) {
        if (userRepository.findByEmail(registrationDto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email address is already in use");
        }

        User user = User.builder()
                .fullName(registrationDto.getFullName())
                .email(registrationDto.getEmail())
                .password(passwordEncoder.encode(registrationDto.getPassword()))
                .build();

        return userRepository.save(user);

    }

    public String loginUser(UserLoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );
        User user = (User) authentication.getPrincipal();
        assert user != null;
        return jwtService.generateToken(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User updateUserProfile(User currentUser, UserProfileUpdateDto updateDto) {
        currentUser.setFullName(updateDto.getFullName().trim());
        if (updateDto.getPhoneNumber() != null) {
            currentUser.setPhoneNumber(updateDto.getPhoneNumber().trim());
        }
        return userRepository.save(currentUser);
    }
}
