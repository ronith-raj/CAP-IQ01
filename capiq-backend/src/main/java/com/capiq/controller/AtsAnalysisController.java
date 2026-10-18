package com.capiq.controller;

import com.capiq.dto.AtsAnalysisRequest;
import com.capiq.dto.AtsAnalysisResponse;
import com.capiq.service.AtsAnalysisService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/resume")
public class AtsAnalysisController {

    private final AtsAnalysisService atsAnalysisService;

    public AtsAnalysisController(
            AtsAnalysisService atsAnalysisService
    ) {
        this.atsAnalysisService = atsAnalysisService;
    }

    @PostMapping("/ats-analysis")
    public AtsAnalysisResponse analyze(
            @RequestBody AtsAnalysisRequest request
    ) {
        try {
            return atsAnalysisService.analyze(request);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    exception.getMessage()
            );
        }
    }
}