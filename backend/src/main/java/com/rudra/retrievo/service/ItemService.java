package com.rudra.retrievo.service;

import com.rudra.retrievo.dto.ItemRequestDto;
import com.rudra.retrievo.dto.ItemResponseDto;
import com.rudra.retrievo.entity.Item;
import com.rudra.retrievo.entity.User;
import com.rudra.retrievo.enums.Category;
import com.rudra.retrievo.enums.ItemStatus;
import com.rudra.retrievo.enums.ItemType;
import com.rudra.retrievo.enums.Role;
import com.rudra.retrievo.exception.ResourceNotFoundException;
import com.rudra.retrievo.exception.UnauthorizedAccessException;
import com.rudra.retrievo.repository.ItemRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;


    @Transactional
    public ItemResponseDto createItem(ItemRequestDto requestDto, User currentUser) {
        Item item = Item.builder()
                .title(requestDto.getTitle())
                .description(requestDto.getDescription())
                .location(requestDto.getLocation())
                .imageUrl(requestDto.getImageUrl())
                .category(requestDto.getCategory())
                .type(requestDto.getType())
                .postedBy(currentUser)
                .dateReported(requestDto.getDateReported())
                .build();

        Item savedItem = itemRepository.save(item);
        return ItemResponseDto.fromEntity(savedItem);
    }

    @Transactional(readOnly = true)
    public ItemResponseDto getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id : " + id));
        return ItemResponseDto.fromEntity(item);
    }

    @Transactional(readOnly = true)
    public Page<ItemResponseDto> getAllItems(
            Category category,
            ItemType type,
            ItemStatus status,
            String search,
            Pageable pageable
    ) {
        Specification<Item> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                predicates.add(cb.or(titleMatch, descMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return itemRepository.findAll(spec, pageable)
                .map(ItemResponseDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<ItemResponseDto> getMyItems(User currentUser, Pageable pageable) {
        return itemRepository.findByPostedById(currentUser.getId(), pageable)
                .map(ItemResponseDto::fromEntity);
    }

    @Transactional
    public ItemResponseDto updateItem(Long id, ItemRequestDto requestDto, User currentUser) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id : " + id));

        checkOwnership(item, currentUser);

        item.setTitle(requestDto.getTitle());
        item.setDescription(requestDto.getDescription());
        item.setLocation(requestDto.getLocation());
        item.setImageUrl(requestDto.getImageUrl());
        item.setCategory(requestDto.getCategory());
        item.setType(requestDto.getType());
        item.setDateReported(requestDto.getDateReported());

        Item updatedItem = itemRepository.save(item);
        return ItemResponseDto.fromEntity(updatedItem);
    }

    @Transactional
    public void deleteItem(Long id, User currentUser) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id : " + id));

        checkOwnership(item, currentUser);

        itemRepository.delete(item);
    }

    private void checkOwnership(Item item, User currentUser) {
        boolean isOwner = item.getPostedBy().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedAccessException("You do not have permission to modify this item");
        }
    }
}
