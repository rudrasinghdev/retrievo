package com.rudra.retrievo.dto;

import com.rudra.retrievo.entity.User;
import com.rudra.retrievo.enums.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponseDto {

    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private boolean isActive;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    public static UserResponseDto fromEntity(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.isActive())
                .created_at(user.getCreatedAt())
                .updated_at(user.getUpdatedAt())
                .build();
    }

}
