package com.example.uicomment.repository;

import com.example.uicomment.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPageUrl(String pageUrl);
    List<Comment> findByStatus(String status);
}
