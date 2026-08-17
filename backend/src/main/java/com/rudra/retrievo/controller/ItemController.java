package com.rudra.retrievo.controller;

import com.rudra.retrievo.dto.ItemRequestDto;
import com.rudra.retrievo.dto.ItemResponseDto;
import com.rudra.retrievo.entity.User;
import com.rudra.retrievo.enums.Category;
import com.rudra.retrievo.enums.ItemStatus;
import com.rudra.retrievo.enums.ItemType;
import com.rudra.retrievo.service.ItemService;
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
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<ItemResponseDto> createItem(
            @Valid @RequestBody ItemRequestDto requestDto,
            @AuthenticationPrincipal User currentUser
    ) {
        ItemResponseDto responseDto = itemService.createItem(requestDto, currentUser);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<ItemResponseDto>> getAllItems(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) ItemType type,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(required = false) String search,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ItemResponseDto> items = itemService.getAllItems(category, type, status, search, pageable);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/me")
    public ResponseEntity<Page<ItemResponseDto>> getMyItems(
            @AuthenticationPrincipal User currentUser,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ItemResponseDto> myItems = itemService.getMyItems(currentUser, pageable);
        return ResponseEntity.ok(myItems);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponseDto> getItemById(@PathVariable Long id) {
        ItemResponseDto item = itemService.getItemById(id);
        return ResponseEntity.ok(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemResponseDto> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody ItemRequestDto requestDto,
            @AuthenticationPrincipal User currentUser
    ) {
        ItemResponseDto item = itemService.updateItem(id, requestDto, currentUser);
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        itemService.deleteItem(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
