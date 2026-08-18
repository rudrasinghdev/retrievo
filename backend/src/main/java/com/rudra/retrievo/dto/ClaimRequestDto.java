package com.rudra.retrievo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClaimRequestDto {

    @NotBlank(message = "Proof description is required")
    @Size(min = 10, max = 1000, message = "Proof description must be between 10 and 1000 characters")
    private String proofDescription;

    private String proofImageUrl;
    
}
