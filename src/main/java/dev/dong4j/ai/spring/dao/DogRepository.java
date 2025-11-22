package dev.dong4j.ai.spring.dao;

import org.springframework.data.annotation.Id;
import org.springframework.data.repository.ListCrudRepository;

/**
 *
 *
 * @author dong4j
 * @version 1.0.0
 * @email "mailto:dong4j@gmail.com"
 * @date 2025.11.22 22:35
 * @since x.x.x
 */
interface DogRepository extends ListCrudRepository<Dog, Integer> {
}


record Dog(@Id int id, String name, String owner, String description) {
}