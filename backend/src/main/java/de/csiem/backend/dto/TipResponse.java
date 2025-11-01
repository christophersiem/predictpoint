package de.csiem.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TipResponse {
    private String id;
    private String betId;
    private Integer selectedOptionIndex;
    private String selectedAnswer;
    private Integer points;
    private Boolean correct;
}
