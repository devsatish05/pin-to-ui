package com.example.uicomment.service;

import com.example.uicomment.model.Comment;
import com.example.uicomment.repository.CommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    private Comment testComment;

    @BeforeEach
    void setUp() {
        testComment = new Comment();
        testComment.setId(1L);
        testComment.setPageUrl("http://localhost:5173/");
        testComment.setContent("Test comment");
        testComment.setPositionX(100);
        testComment.setPositionY(200);
        testComment.setStatus("OPEN");
        testComment.setPriority("MEDIUM");
    }

    @Test
    void testGetAllComments() {
        when(commentRepository.findAll()).thenReturn(Arrays.asList(testComment));

        List<Comment> comments = commentService.getAllComments();

        assertNotNull(comments);
        assertEquals(1, comments.size());
        assertEquals("Test comment", comments.get(0).getContent());
        verify(commentRepository, times(1)).findAll();
    }

    @Test
    void testGetCommentById() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(testComment));

        Optional<Comment> result = commentService.getCommentById(1L);

        assertTrue(result.isPresent());
        assertEquals("Test comment", result.get().getContent());
        verify(commentRepository, times(1)).findById(1L);
    }

    @Test
    void testGetCommentByIdNotFound() {
        when(commentRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Comment> result = commentService.getCommentById(999L);

        assertFalse(result.isPresent());
        verify(commentRepository, times(1)).findById(999L);
    }

    @Test
    void testGetCommentsByPageUrl() {
        when(commentRepository.findByPageUrl(anyString())).thenReturn(Arrays.asList(testComment));

        List<Comment> comments = commentService.getCommentsByPageUrl("http://localhost:5173/");

        assertNotNull(comments);
        assertEquals(1, comments.size());
        assertEquals("http://localhost:5173/", comments.get(0).getPageUrl());
        verify(commentRepository, times(1)).findByPageUrl(anyString());
    }

    @Test
    void testGetCommentsByStatus() {
        when(commentRepository.findByStatus("OPEN")).thenReturn(Arrays.asList(testComment));

        List<Comment> comments = commentService.getCommentsByStatus("OPEN");

        assertNotNull(comments);
        assertEquals(1, comments.size());
        assertEquals("OPEN", comments.get(0).getStatus());
        verify(commentRepository, times(1)).findByStatus("OPEN");
    }

    @Test
    void testCreateComment() {
        when(commentRepository.save(any(Comment.class))).thenReturn(testComment);

        Comment created = commentService.createComment(testComment);

        assertNotNull(created);
        assertEquals("Test comment", created.getContent());
        assertNotNull(created.getCreatedAt());
        assertNotNull(created.getUpdatedAt());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void testUpdateCommentSuccess() {
        Comment updates = new Comment();
        updates.setStatus("RESOLVED");
        updates.setPriority("HIGH");

        when(commentRepository.findById(1L)).thenReturn(Optional.of(testComment));
        when(commentRepository.save(any(Comment.class))).thenReturn(testComment);

        Comment updated = commentService.updateComment(1L, updates);

        assertNotNull(updated);
        verify(commentRepository, times(1)).findById(1L);
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void testUpdateCommentNotFound() {
        Comment updates = new Comment();
        updates.setStatus("RESOLVED");

        when(commentRepository.findById(999L)).thenReturn(Optional.empty());

        Comment updated = commentService.updateComment(999L, updates);

        assertNull(updated);
        verify(commentRepository, times(1)).findById(999L);
        verify(commentRepository, never()).save(any(Comment.class));
    }

    @Test
    void testUpdateCommentOnlyNonNullFields() {
        Comment updates = new Comment();
        updates.setStatus("RESOLVED");
        // Other fields are null, should not be updated

        Comment existing = new Comment();
        existing.setId(1L);
        existing.setContent("Original content");
        existing.setPositionX(50);
        existing.setPositionY(75);
        existing.setStatus("OPEN");

        when(commentRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(commentRepository.save(any(Comment.class))).thenAnswer(i -> i.getArguments()[0]);

        Comment updated = commentService.updateComment(1L, updates);

        assertNotNull(updated);
        assertEquals("Original content", updated.getContent()); // Should not change
        assertEquals(50, updated.getPositionX()); // Should not change
        assertEquals("RESOLVED", updated.getStatus()); // Should be updated
    }

    @Test
    void testDeleteComment() {
        doNothing().when(commentRepository).deleteById(1L);

        commentService.deleteComment(1L);

        verify(commentRepository, times(1)).deleteById(1L);
    }
}
