package com.example.uicomment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String pageUrl;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Integer positionX;

    @Column(nullable = false)
    private Integer positionY;

    private String screenshotUrl;

    @Column(length = 50)
    private String status; // OPEN, IN_PROGRESS, RESOLVED, CLOSED

    @Column(length = 50)
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL

    private String authorName;

    private String authorEmail;

    @Column(length = 100)
    private String category; // BUG, FEATURE, IMPROVEMENT, QUESTION

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(length = 1000)
    private String resolution;

    private String assignedTo;
}
