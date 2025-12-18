package com.example.uicomment.controller;

import com.example.uicomment.dto.CommentResponse;
import com.example.uicomment.dto.CreateCommentRequest;
import com.example.uicomment.dto.UpdateCommentRequest;
import com.example.uicomment.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${cors.allowed.origins}")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(@Valid @RequestBody CreateCommentRequest request) {
        log.info("Received request to create comment");
        CommentResponse response = commentService.createComment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getAllComments() {
        log.info("Received request to get all comments");
        List<CommentResponse> comments = commentService.getAllComments();
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentResponse> getCommentById(@PathVariable Long id) {
        log.info("Received request to get comment with ID: {}", id);
        CommentResponse comment = commentService.getCommentById(id);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/page")
    public ResponseEntity<List<CommentResponse>> getCommentsByPageUrl(@RequestParam String url) {
        log.info("Received request to get comments for page: {}", url);
        List<CommentResponse> comments = commentService.getCommentsByPageUrl(url);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CommentResponse>> getCommentsByStatus(@PathVariable String status) {
        log.info("Received request to get comments with status: {}", status);
        List<CommentResponse> comments = commentService.getCommentsByStatus(status);
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCommentRequest request) {
        log.info("Received request to update comment with ID: {}", id);
        CommentResponse response = commentService.updateComment(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        log.info("Received request to delete comment with ID: {}", id);
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
