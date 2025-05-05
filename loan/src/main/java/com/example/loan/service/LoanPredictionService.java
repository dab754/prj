package com.example.loan.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@Service
public class LoanPredictionService {

    private static final String PYTHON_API_URL = "http://localhost:5000/predict";

    public double predictMaxLoanAmount(double income) {
        RestTemplate restTemplate = new RestTemplate();

        // Prepare the request body
        Map<String, Double> requestBody = new HashMap<>();
        requestBody.put("income", income);

        // Call the Python API
        ResponseEntity<Map> response = restTemplate.postForEntity(PYTHON_API_URL, requestBody, Map.class);

        // Extract the prediction
        return (double) response.getBody().get("max_loan_amount");
    }
}