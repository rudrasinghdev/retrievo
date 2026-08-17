package com.rudra.retrievo.dto;

import com.rudra.retrievo.entity.Item;
import com.rudra.retrievo.enums.Category;
import com.rudra.retrievo.enums.ItemStatus;
import com.rudra.retrievo.enums.ItemType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemResponseDto {

    private Long id;
    private String title;
    private String description;
    private String location;
    private String imageUrl;
    private Category category;
    private ItemType type;
    private ItemStatus status;
    private UserResponseDto postedBy;
    private LocalDateTime dateReported;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ItemResponseDto fromEntity(Item item) {
        return ItemResponseDto.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .location(item.getLocation())
                .imageUrl(item.getImageUrl())
                .category(item.getCategory())
                .type(item.getType())
                .status(item.getStatus())
                .postedBy(UserResponseDto.fromEntity(item.getPostedBy()))
                .dateReported(item.getDateReported())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

}
