package com.example.uicomment.controller;

import com.example.uicomment.model.Comment;
import com.example.uicomment.repository.CommentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CommentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Comment testComment;

    @BeforeEach
    void setUp() {
        commentRepository.deleteAll();
        
        testComment = new Comment();
        testComment.setPageUrl("http://localhost:5173/");
        testComment.setContent("Test comment");
        testComment.setPositionX(100);
        testComment.setPositionY(200);
        testComment.setStatus("OPEN");
        testComment.setPriority("MEDIUM");
        testComment.setAuthorName("Test User");
        testComment.setAuthorEmail("test@example.com");
        testComment.setCategory("BUG");
        testComment.setCreatedAt(new Date());
        testComment.setUpdatedAt(new Date());
    }

    @Test
    void testCreateComment() throws Exception {
        mockMvc.perform(post("/api/comments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testComment)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.content").value("Test comment"))
                .andExpect(jsonPath("$.status").value("OPEN"))
                .andExpect(jsonPath("$.priority").value("MEDIUM"));
    }

    @Test
    void testGetAllComments() throws Exception {
        commentRepository.save(testComment);

        mockMvc.perform(get("/api/comments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].content").value("Test comment"));
    }

    @Test
    void testGetCommentById() throws Exception {
        Comment saved = commentRepository.save(testComment);

        mockMvc.perform(get("/api/comments/" + saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.content").value("Test comment"));
    }

    @Test
    void testGetCommentByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/comments/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetCommentsByPageUrl() throws Exception {
        commentRepository.save(testComment);

        mockMvc.perform(get("/api/comments/page")
                .param("url", "http://localhost:5173/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].pageUrl").value("http://localhost:5173/"));
    }

    @Test
    void testGetCommentsByStatus() throws Exception {
        commentRepository.save(testComment);

        mockMvc.perform(get("/api/comments/status/OPEN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].status").value("OPEN"));
    }

    @Test
    void testUpdateComment() throws Exception {
        Comment saved = commentRepository.save(testComment);

        Comment updates = new Comment();
        updates.setStatus("RESOLVED");
        updates.setPriority("HIGH");

        mockMvc.perform(put("/api/comments/" + saved.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updates)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RESOLVED"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.content").value("Test comment")); // Should preserve original
    }

    @Test
    void testUpdateCommentNotFound() throws Exception {
        Comment updates = new Comment();
        updates.setStatus("RESOLVED");

        mockMvc.perform(put("/api/comments/99999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updates)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteComment() throws Exception {
        Comment saved = commentRepository.save(testComment);

        mockMvc.perform(delete("/api/comments/" + saved.getId()))
                .andExpect(status().isNoContent());

        // Verify it was deleted
        mockMvc.perform(get("/api/comments/" + saved.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateCommentPartialFields() throws Exception {
        Comment saved = commentRepository.save(testComment);

        // Only update status, everything else should remain
        Comment updates = new Comment();
        updates.setStatus("IN_PROGRESS");

        mockMvc.perform(put("/api/comments/" + saved.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updates)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.priority").value("MEDIUM"))
                .andExpect(jsonPath("$.content").value("Test comment"))
                .andExpect(jsonPath("$.authorName").value("Test User"));
    }
}
