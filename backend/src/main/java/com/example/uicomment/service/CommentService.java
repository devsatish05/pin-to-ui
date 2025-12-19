package com.example.uicomment.service;

import com.example.uicomment.model.Comment;
import com.example.uicomment.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Optional<Comment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    public List<Comment> getCommentsByPageUrl(String pageUrl) {
        return commentRepository.findByPageUrl(pageUrl);
    }

    public List<Comment> getCommentsByStatus(String status) {
        return commentRepository.findByStatus(status);
    }

    public Comment createComment(Comment comment) {
        comment.setCreatedAt(new Date());
        comment.setUpdatedAt(new Date());
        return commentRepository.save(comment);
    }

    public Comment updateComment(Long id, Comment updates) {
        Optional<Comment> optional = commentRepository.findById(id);
        if (!optional.isPresent()) return null;
        Comment comment = optional.get();
        // Update only non-null fields
        if (updates.getContent() != null) {
            comment.setContent(updates.getContent());
        }
        if (updates.getPositionX() != null) {
            comment.setPositionX(updates.getPositionX());
        }
        if (updates.getPositionY() != null) {
            comment.setPositionY(updates.getPositionY());
        }
        if (updates.getScreenshotUrl() != null) {
            comment.setScreenshotUrl(updates.getScreenshotUrl());
        }
        if (updates.getStatus() != null) {
            comment.setStatus(updates.getStatus());
        }
        if (updates.getPriority() != null) {
            comment.setPriority(updates.getPriority());
        }
        if (updates.getAuthorName() != null) {
            comment.setAuthorName(updates.getAuthorName());
        }
        if (updates.getAuthorEmail() != null) {
            comment.setAuthorEmail(updates.getAuthorEmail());
        }
        if (updates.getCategory() != null) {
            comment.setCategory(updates.getCategory());
        }
        if (updates.getResolution() != null) {
            comment.setResolution(updates.getResolution());
        }
        if (updates.getAssignedTo() != null) {
            comment.setAssignedTo(updates.getAssignedTo());
        }
        comment.setUpdatedAt(new Date());
        return commentRepository.save(comment);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
