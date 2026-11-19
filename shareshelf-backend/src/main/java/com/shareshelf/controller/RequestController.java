package com.shareshelf.controller;

import com.shareshelf.dto.ApproveRequestDto;
import com.shareshelf.dto.BorrowRequestResponse;
import com.shareshelf.dto.CreateRequestDto;
import com.shareshelf.service.RequestService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BorrowRequestResponse create(@Valid @RequestBody CreateRequestDto dto, Authentication auth) {
        return requestService.create(auth.getName(), dto);
    }

    @GetMapping("/sent")
    public List<BorrowRequestResponse> sent(Authentication auth) {
        return requestService.sent(auth.getName());
    }

    @GetMapping("/received")
    public List<BorrowRequestResponse> received(Authentication auth) {
        return requestService.received(auth.getName());
    }

    @PutMapping("/{id}/approve")
    public BorrowRequestResponse approve(@PathVariable Long id,
                                         @RequestBody(required = false) ApproveRequestDto dto,
                                         Authentication auth) {
        return requestService.approve(auth.getName(), id, dto);
    }

    @PutMapping("/{id}/reject")
    public BorrowRequestResponse reject(@PathVariable Long id, Authentication auth) {
        return requestService.reject(auth.getName(), id);
    }

    @PutMapping("/{id}/return")
    public BorrowRequestResponse markReturned(@PathVariable Long id, Authentication auth) {
        return requestService.markReturned(auth.getName(), id);
    }

    @PutMapping("/{id}/cancel")
    public BorrowRequestResponse cancel(@PathVariable Long id, Authentication auth) {
        return requestService.cancel(auth.getName(), id);
    }
}
