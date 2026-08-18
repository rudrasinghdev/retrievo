package com.rudra.retrievo.repository;

import com.rudra.retrievo.entity.Claim;
import com.rudra.retrievo.enums.ClaimStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    @EntityGraph(attributePaths = {"item", "claimant"})
    Page<Claim> findByClaimantId(Long claimantId, Pageable pageable);

    @EntityGraph(attributePaths = {"item", "claimant"})
    Page<Claim> findByItemId(Long itemId, Pageable pageable);

    boolean existsByItemIdAndClaimantIdAndStatus(Long itemId, Long claimantId, ClaimStatus status);

    List<Claim> findByItemIdAndStatus(Long ItemId, ClaimStatus status);

    Long id(Long id);
}
