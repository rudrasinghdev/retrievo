package com.rudra.retrievo.controller;

import com.rudra.retrievo.dto.ClaimRequestDto;
import com.rudra.retrievo.dto.ClaimResponseDto;
import com.rudra.retrievo.dto.ClaimStatusUpdateDto;
import com.rudra.retrievo.entity.User;
import com.rudra.retrievo.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping("/api/items/{itemId}/claims")
    public ResponseEntity<ClaimResponseDto> submitClaim(
            @PathVariable Long itemId,
            @Valid @RequestBody ClaimRequestDto requestDto,
            @AuthenticationPrincipal User currentUser
    ) {
        ClaimResponseDto responseDto = claimService.submitClaim(itemId, requestDto, currentUser);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping("/api/items/{itemId}/claims")
    public ResponseEntity<Page<ClaimResponseDto>> getClaimsByItemId(
            @PathVariable Long itemId,
            @AuthenticationPrincipal User currentUser,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ClaimResponseDto> claims = claimService.getClaimsByItemId(itemId, currentUser, pageable);
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/api/claims/me")
    public ResponseEntity<Page<ClaimResponseDto>> getMyClaims(
            @AuthenticationPrincipal User currentUser,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ClaimResponseDto> claims = claimService.getMyClaims(currentUser, pageable);
        return ResponseEntity.ok(claims);
    }

    @PatchMapping("/api/claims/{claimId}/status")
    public ResponseEntity<ClaimResponseDto> updateClaimStatus(
            @PathVariable Long claimId,
            @Valid @RequestBody ClaimStatusUpdateDto statusDto,
            @AuthenticationPrincipal User currentUser
    ) {
        ClaimResponseDto updatedClaim = claimService.updateClaimStatus(claimId, statusDto, currentUser);
        return ResponseEntity.ok(updatedClaim);
    }
}

