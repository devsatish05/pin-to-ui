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
        // Update fields
        comment.setContent(updates.getContent());
        comment.setPositionX(updates.getPositionX());
        comment.setPositionY(updates.getPositionY());
        comment.setScreenshotUrl(updates.getScreenshotUrl());
        comment.setStatus(updates.getStatus());
        comment.setPriority(updates.getPriority());
        comment.setAuthorName(updates.getAuthorName());
        comment.setAuthorEmail(updates.getAuthorEmail());
        comment.setCategory(updates.getCategory());
        comment.setResolution(updates.getResolution());
        comment.setAssignedTo(updates.getAssignedTo());
        comment.setUpdatedAt(new Date());
        return commentRepository.save(comment);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
