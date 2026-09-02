package com.rudra.retrievo.config;

import org.jspecify.annotations.NonNull;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.Embedding;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Configuration
public class AiConfig {

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    @Bean
    @Primary
    public EmbeddingModel customGoogleEmbeddingModel(RestClient.Builder restClientBuilder) {
        RestClient restClient = restClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/openai/embeddings")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
        return new EmbeddingModel() {
            @Override
            public @NonNull EmbeddingResponse call(@NonNull EmbeddingRequest request) {
                List<String> instructions = request.getInstructions();
                List<Embedding> embeddings = new ArrayList<>();
                for (int i = 0; i < instructions.size(); i++) {
                    String text = instructions.get(i);
                    Map<String, Object> payload = Map.of(
                            "model", "gemini-embedding-001",
                            "dimensions", 1536,
                            "input", text
                    );
                    Map<?, ?> response = restClient.post()
                            .body(payload)
                            .retrieve()
                            .body(Map.class);
                    if (response != null && response.containsKey("data")) {
                        List<?> dataList = (List<?>) response.get("data");
                        if (!dataList.isEmpty()) {
                            Map<?, ?> item = (Map<?, ?>) dataList.get(0);
                            List<?> rawEmbedding = (List<?>) item.get("embedding");
                            float[] vector = new float[rawEmbedding.size()];
                            for (int j = 0; j < rawEmbedding.size(); j++) {
                                vector[j] = ((Number) rawEmbedding.get(j)).floatValue();
                            }
                            embeddings.add(new Embedding(vector, i));
                        }
                    }
                }
                return new EmbeddingResponse(embeddings);
            }

            @Override
            public float @NonNull [] embed(@NonNull Document document) {
                assert document.getText() != null;
                return embed(document.getText());
            }

            @Override
            public int dimensions() {
                return 1536;
            }
        };
    }

}
