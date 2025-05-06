package com.example.loan.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class LoanPredictionService {
    private static final Logger logger = LoggerFactory.getLogger(LoanPredictionService.class);
    private static final String PYTHON_API_URL = "http://localhost:5000/predict";

    public double predictMaxLoanAmount(double income) {
        logger.info("Making prediction request for income: {}", income);
        RestTemplate restTemplate = new RestTemplate();

        // Prepare the request body
        Map<String, Double> requestBody = new HashMap<>();
        requestBody.put("income", income);
        logger.info("Request body: {}", requestBody);

        try {
            // Call the Python API
            logger.info("Sending request to Flask API at: {}", PYTHON_API_URL);
            ResponseEntity<Map> response = restTemplate.postForEntity(PYTHON_API_URL, requestBody, Map.class);
            logger.info("Received response status: {}", response.getStatusCode());
            
            Map<String, Object> responseBody = response.getBody();
            logger.info("Response body: {}", responseBody);
            
            if (responseBody != null && responseBody.containsKey("max_loan_amount")) {
                // Extract the prediction and convert to double
                Object maxLoanAmount = responseBody.get("max_loan_amount");
                logger.info("Raw max_loan_amount value: {}", maxLoanAmount);
                
                if (maxLoanAmount instanceof Number) {
                    double result = ((Number) maxLoanAmount).doubleValue();
                    logger.info("Converted max_loan_amount to double: {}", result);
                    return result;
                }
                logger.error("max_loan_amount is not a number: {}", maxLoanAmount.getClass());
            }
            logger.error("Invalid response format: {}", responseBody);
            throw new RuntimeException("Invalid response from prediction service");
        } catch (Exception e) {
            logger.error("Error calling prediction service", e);
            throw new RuntimeException("Error calling prediction service: " + e.getMessage());
        }
    }
}