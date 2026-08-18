package com.rudra.retrievo.dto;

import com.rudra.retrievo.enums.ClaimStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClaimStatusUpdateDto {

    @NotNull(message = "Claim status is required")
    private ClaimStatus status;

}
