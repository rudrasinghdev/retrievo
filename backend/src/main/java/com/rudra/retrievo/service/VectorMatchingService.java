package com.rudra.retrievo.service;

import com.rudra.retrievo.dto.ItemMatchResponseDto;
import com.rudra.retrievo.entity.Item;
import com.rudra.retrievo.enums.Category;
import com.rudra.retrievo.enums.ItemStatus;
import com.rudra.retrievo.enums.ItemType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class VectorMatchingService {

    private final VectorStore vectorStore;

    public void indexItem(Item item) {
        String fusedContent = String.format(
                "Title: %s. Category: %s. Location: %s. Type: %s. Description: %s",
                item.getTitle(),
                item.getCategory(),
                item.getLocation(),
                item.getType(),
                item.getDescription()
        );

        UUID docId = UUID.nameUUIDFromBytes(("retrievo-item-" + item.getId()).getBytes());
        Document doc = Document.builder()
                .id(docId.toString())
                .text(fusedContent)
                .metadata(Map.of(
                        "itemId", item.getId(),
                        "title", item.getTitle(),
                        "type", item.getType().name(),
                        "status", item.getStatus().name(),
                        "category", item.getCategory().name(),
                        "location", item.getLocation(),
                        "imageUrl", item.getImageUrl() != null ? item.getImageUrl() : ""
                ))
                .build();
        vectorStore.add(List.of(doc));
        log.info("Indexed item #{} (UUID: {}) into pgvector store", item.getId(), docId);
    }

    public List<ItemMatchResponseDto> findMatches(String query, ItemType targetType, double minScore) {
        SearchRequest searchRequest = SearchRequest.builder()
                .query(query)
                .topK(5)
                .similarityThreshold(minScore)
                .build();
        List<Document> documents = vectorStore.similaritySearch(searchRequest);

        List<ItemMatchResponseDto> results = new ArrayList<>();
        for (Document doc : documents) {
            Map<String, Object> metadata = doc.getMetadata();
            String docType = (String) metadata.get("type");

            if (targetType != null && !targetType.name().equalsIgnoreCase(docType)) {
                continue;
            }
            double score = doc.getScore() != null ? doc.getScore() : 0.0;
            Long realItemId = ((Number) metadata.get("itemId")).longValue();
            results.add(ItemMatchResponseDto.builder()
                    .id(realItemId)
                    .title((String) metadata.get("title"))
                    .description(doc.getText())
                    .location((String) metadata.get("location"))
                    .imageUrl((String) metadata.get("imageUrl"))
                    .category(Category.valueOf((String) metadata.get("category")))
                    .type(ItemType.valueOf(docType))
                    .status(ItemStatus.valueOf((String) metadata.get("status")))
                    .similarityScore(Math.round(score * 100.0) / 100.0)
                    .build());
        }
        return results;
    }

    public void deleteItemIndex(Long itemId) {
        UUID docId = UUID.nameUUIDFromBytes(("retrievo-item-" + itemId).getBytes());
        vectorStore.delete(List.of(docId.toString()));
        log.info("Removed item #{} (UUID: {}) from pgvector store", itemId, docId);
    }

}
