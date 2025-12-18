package com.example.uicomment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {

    private Long id;
    private String pageUrl;
    private String content;
    private Integer positionX;
    private Integer positionY;
    private String screenshotUrl;
    private String status;
    private String priority;
    private String authorName;
    private String authorEmail;
    private String category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String resolution;
    private String assignedTo;
}
