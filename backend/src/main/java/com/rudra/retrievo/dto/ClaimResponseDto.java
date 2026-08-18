package com.rudra.retrievo.dto;

import com.rudra.retrievo.entity.Claim;
import com.rudra.retrievo.enums.ClaimStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClaimResponseDto {

    private Long id;
    private Long itemId;
    private String itemTitle;
    private UserResponseDto claimant;
    private String proofDescription;
    private String proofImageUrl;
    private ClaimStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ClaimResponseDto fromEntity(Claim claim) {
        return ClaimResponseDto.builder()
                .id(claim.getId())
                .itemId(claim.getItem().getId())
                .itemTitle(claim.getItem().getTitle())
                .claimant(UserResponseDto.fromEntity(claim.getClaimant()))
                .proofDescription(claim.getProofDescription())
                .proofImageUrl(claim.getProofImageUrl())
                .status(claim.getStatus())
                .createdAt(claim.getCreatedAt())
                .updatedAt(claim.getUpdatedAt())
                .build();
    }

}
