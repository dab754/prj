package com.example.loan.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to the Loan Management System API. Available endpoints: /loans, /loans/{id}, /loans/new, /loans/{id}/repay";
    }
} 