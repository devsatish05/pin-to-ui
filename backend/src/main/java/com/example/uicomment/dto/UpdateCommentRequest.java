package com.example.uicomment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCommentRequest {

    private String content;
    private String status;
    private String priority;
    private String resolution;
    private String assignedTo;
    private String category;
}
