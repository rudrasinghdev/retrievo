package com.rudra.retrievo.dto;

import com.rudra.retrievo.enums.Category;
import com.rudra.retrievo.enums.ItemStatus;
import com.rudra.retrievo.enums.ItemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemMatchResponseDto {

    private Long id;
    private String title;
    private String description;
    private String location;
    private String imageUrl;
    private Category category;
    private ItemType type;
    private ItemStatus status;
    private double similarityScore;

}
