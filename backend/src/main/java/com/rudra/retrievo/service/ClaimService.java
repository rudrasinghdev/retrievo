package com.rudra.retrievo.service;

import com.rudra.retrievo.dto.ClaimRequestDto;
import com.rudra.retrievo.dto.ClaimResponseDto;
import com.rudra.retrievo.dto.ClaimStatusUpdateDto;
import com.rudra.retrievo.entity.Claim;
import com.rudra.retrievo.entity.Item;
import com.rudra.retrievo.entity.User;
import com.rudra.retrievo.enums.ClaimStatus;
import com.rudra.retrievo.enums.ItemStatus;
import com.rudra.retrievo.enums.Role;
import com.rudra.retrievo.exception.BadRequestException;
import com.rudra.retrievo.exception.ResourceNotFoundException;
import com.rudra.retrievo.exception.UnauthorizedAccessException;
import com.rudra.retrievo.repository.ClaimRepository;
import com.rudra.retrievo.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;

    @Transactional
    public ClaimResponseDto submitClaim(Long itemId, ClaimRequestDto requestDto, User claimant) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        if (item.getPostedBy().getId().equals(claimant.getId())) {
            throw new BadRequestException("You cannot claim an item that you posted yourself");
        }

        if (item.getStatus() != ItemStatus.OPEN) {
            throw new BadRequestException("Cannot claim an item that is already " + item.getStatus());
        }

        if (claimRepository.existsByItemIdAndClaimantIdAndStatus(itemId, claimant.getId(), ClaimStatus.PENDING)) {
            throw new BadRequestException("You already have an active pending claim for this item");
        }
        Claim claim = Claim.builder()
                .item(item)
                .claimant(claimant)
                .proofDescription(requestDto.getProofDescription())
                .proofImageUrl(requestDto.getProofImageUrl())
                .build();

        Claim savedClaim = claimRepository.save(claim);
        return ClaimResponseDto.fromEntity(savedClaim);

    }

    @Transactional(readOnly = true)
    public Page<ClaimResponseDto> getMyClaims(User claimant, Pageable pageable) {
        return claimRepository.findByClaimantId(claimant.getId(), pageable)
                .map(ClaimResponseDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<ClaimResponseDto> getClaimsByItemId(Long itemId, User currentUser, Pageable pageable) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        boolean isPoster = item.getPostedBy().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isPoster && !isAdmin) {
            throw new UnauthorizedAccessException("You do not have permission to view claims for this item");
        }

        return claimRepository.findByItemId(itemId, pageable)
                .map(ClaimResponseDto::fromEntity);

    }

    @Transactional
    public ClaimResponseDto updateClaimStatus(Long claimId, ClaimStatusUpdateDto statusDto, User currentUser) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + claimId));

        Item item = claim.getItem();
        boolean isPoster = item.getPostedBy().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isPoster && !isAdmin) {
            throw new UnauthorizedAccessException("You do not have permission to review this claim");
        }

        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new BadRequestException("Only PENDING claims can be reviewed");
        }

        ClaimStatus newStatus = statusDto.getStatus();
        if (newStatus == ClaimStatus.PENDING) {
            throw new BadRequestException("Cannot revert a claim status to PENDING");
        }
        if (newStatus == ClaimStatus.APPROVED) {
            if (item.getStatus() != ItemStatus.OPEN) {
                throw new BadRequestException("Cannot approve claim because the item is already " + item.getStatus());
            }

            claim.setStatus(ClaimStatus.APPROVED);
            item.setStatus(ItemStatus.CLAIMED);
            itemRepository.save(item);

            List<Claim> otherPendingClaims = claimRepository.findByItemIdAndStatus(item.getId(), ClaimStatus.PENDING);
            for (Claim other : otherPendingClaims) {
                if (!other.getId().equals(claim.getId())) {
                    other.setStatus(ClaimStatus.REJECTED);
                }
            }
            claimRepository.saveAll(otherPendingClaims);

        } else if (newStatus == ClaimStatus.REJECTED) {
            claim.setStatus(ClaimStatus.REJECTED);
        }

        Claim updatedClaim = claimRepository.save(claim);
        return ClaimResponseDto.fromEntity(updatedClaim);
    }
}
