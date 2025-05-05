package com.example.loan.service;

import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;

@Service

public class LoanSimulationService {
    private static final DecimalFormat df = new DecimalFormat("0.00");

    public Map<String, String> simulateRepayment(double loanAmount, double monthlyIncome, double repaymentRatio) {
        double monthlyRepayment = monthlyIncome * repaymentRatio;
        double durationMonths = loanAmount / monthlyRepayment;
        double durationWeeks = durationMonths * 4;

        Map<String, String> result = new HashMap<>();
        result.put("message", "Based on your income and repayment ratio, here's the repayment plan:");
        result.put("monthlyRepayment", df.format(monthlyRepayment));
        result.put("durationMonths", df.format(durationMonths));
        result.put("durationWeeks", df.format(durationWeeks));
        return result;
    }
}
