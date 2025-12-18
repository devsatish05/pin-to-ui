package com.example.uicomment.service;

import com.example.uicomment.dto.CommentResponse;
import com.example.uicomment.dto.CreateCommentRequest;
import com.example.uicomment.dto.UpdateCommentRequest;
import com.example.uicomment.exception.ResourceNotFoundException;
import com.example.uicomment.model.Comment;
import com.example.uicomment.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;

    @Transactional
    public CommentResponse createComment(CreateCommentRequest request) {
        log.info("Creating new comment for page: {}", request.getPageUrl());

        Comment comment = Comment.builder()
                .pageUrl(request.getPageUrl())
                .content(request.getContent())
                .positionX(request.getPositionX())
                .positionY(request.getPositionY())
                .screenshotUrl(request.getScreenshotUrl())
                .status(request.getStatus() != null ? request.getStatus() : "OPEN")
                .priority(request.getPriority() != null ? request.getPriority() : "MEDIUM")
                .authorName(request.getAuthorName())
                .authorEmail(request.getAuthorEmail())
                .category(request.getCategory() != null ? request.getCategory() : "GENERAL")
                .build();

        Comment savedComment = commentRepository.save(comment);
        log.info("Comment created successfully with ID: {}", savedComment.getId());

        return mapToResponse(savedComment);
    }

    public List<CommentResponse> getAllComments() {
        log.info("Fetching all comments");
        return commentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CommentResponse getCommentById(Long id) {
        log.info("Fetching comment with ID: {}", id);
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with ID: " + id));
        return mapToResponse(comment);
    }

    public List<CommentResponse> getCommentsByPageUrl(String pageUrl) {
        log.info("Fetching comments for page: {}", pageUrl);
        return commentRepository.findByPageUrl(pageUrl).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CommentResponse> getCommentsByStatus(String status) {
        log.info("Fetching comments with status: {}", status);
        return commentRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse updateComment(Long id, UpdateCommentRequest request) {
        log.info("Updating comment with ID: {}", id);

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with ID: " + id));

        if (request.getContent() != null) {
            comment.setContent(request.getContent());
        }
        if (request.getStatus() != null) {
            comment.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            comment.setPriority(request.getPriority());
        }
        if (request.getResolution() != null) {
            comment.setResolution(request.getResolution());
        }
        if (request.getAssignedTo() != null) {
            comment.setAssignedTo(request.getAssignedTo());
        }
        if (request.getCategory() != null) {
            comment.setCategory(request.getCategory());
        }

        Comment updatedComment = commentRepository.save(comment);
        log.info("Comment updated successfully with ID: {}", updatedComment.getId());

        return mapToResponse(updatedComment);
    }

    @Transactional
    public void deleteComment(Long id) {
        log.info("Deleting comment with ID: {}", id);

        if (!commentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Comment not found with ID: " + id);
        }

        commentRepository.deleteById(id);
        log.info("Comment deleted successfully with ID: {}", id);
    }

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .pageUrl(comment.getPageUrl())
                .content(comment.getContent())
                .positionX(comment.getPositionX())
                .positionY(comment.getPositionY())
                .screenshotUrl(comment.getScreenshotUrl())
                .status(comment.getStatus())
                .priority(comment.getPriority())
                .authorName(comment.getAuthorName())
                .authorEmail(comment.getAuthorEmail())
                .category(comment.getCategory())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .resolution(comment.getResolution())
                .assignedTo(comment.getAssignedTo())
                .build();
    }
}
