package com.rudra.retrievo.repository;

import com.rudra.retrievo.entity.Item;
import com.rudra.retrievo.enums.ItemStatus;
import com.rudra.retrievo.enums.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByType(ItemType type);

    List<Item> findByStatus(ItemStatus status);

    List<Item> findByTypeAndStatus(ItemType type, ItemStatus status);

}
