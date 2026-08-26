package com.curiolearn.search;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doAnswer;

public class SearchControllerTest {

    private JdbcTemplate jdbcTemplate;
    private SearchController searchController;

    @BeforeEach
    public void setup() {
        jdbcTemplate = Mockito.mock(JdbcTemplate.class);
        searchController = new SearchController(jdbcTemplate);
    }

    @Test
    public void testSearchShortQueryReturnsEmpty() {
        ResponseEntity<Map<String, Object>> response = searchController.search("a", null, 10, 0);
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().get("total"));
    }

    @Test
    public void testSearchValidQueryReturnsResults() {
        List<Map<String, Object>> mockRows = new ArrayList<>();
        Map<String, Object> row = new HashMap<>();
        row.put("id", UUID.randomUUID().toString());
        row.put("title", "Cardiovascular Physiology");
        row.put("code", "PHYS-101");
        row.put("type", "subject");
        mockRows.add(row);

        doAnswer(inv -> mockRows).when(jdbcTemplate).queryForList(anyString(), any(Object[].class));

        ResponseEntity<Map<String, Object>> response = searchController.search("cardio", "ALLOPATHIC", 10, 0);
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().get("total"));
    }
}