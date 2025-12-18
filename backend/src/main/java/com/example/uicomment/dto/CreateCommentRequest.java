package com.example.uicomment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCommentRequest {

    @NotBlank(message = "Page URL is required")
    private String pageUrl;

    @NotBlank(message = "Comment content is required")
    private String content;

    @NotNull(message = "X position is required")
    private Integer positionX;

    @NotNull(message = "Y position is required")
    private Integer positionY;

    private String screenshotUrl;

    private String status;

    private String priority;

    private String authorName;

    private String authorEmail;

    private String category;
}
