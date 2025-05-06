package com.example.loan.controller;

import com.example.loan.entity.Loan;
import com.example.loan.entity.LoanStatus;
import com.example.loan.service.LoanPredictionService;
import com.example.loan.service.LoanService;
import com.example.loan.service.LoanSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "http://localhost:4202", "http://localhost:4203", "http://localhost:4204", "http://localhost:4205"})
@RestController
@RequestMapping("/loans")
public class LoanController {

    @Autowired
    private LoanService loanService;

    // Get all loans
    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    // Get a loan by ID
    @GetMapping("/{id}")
    public Loan getLoanById(@PathVariable Long id) {
        return loanService.getLoanById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
    }

    // Create a new loan
    @PostMapping
    public Loan createLoan(@RequestBody Loan loan) {
        if (loan.getFreelancer() == null || loan.getFreelancer().getId() == null) {
            throw new RuntimeException("Freelancer ID is required");
        }

        return loanService.createLoan(loan);
    }

    // Update an existing loan
    @PutMapping("/{id}")
    public Loan updateLoan(@PathVariable Long id, @RequestBody Loan loanDetails) {
        return loanService.updateLoan(id, loanDetails);
    }

    // Delete a loan
    @DeleteMapping("/{id}")
    public void deleteLoan(@PathVariable Long id) {
        loanService.deleteLoan(id);
    }

    // Get loan history for a freelancer with filters
    @GetMapping("/history")
    public List<Loan> getLoanHistory(
            @RequestParam Long freelancerId,
            @RequestParam(required = false) LoanStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return loanService.getLoanHistory(freelancerId, status, startDate, endDate);
    }

    @PostMapping("/{id}/repay")
    public ResponseEntity<?> makeRepayment(
            @PathVariable Long id,
            @RequestParam Long freelancerId,
            @RequestParam double amount) {
        try {
            Loan updatedLoan = loanService.makeRepayment(id, freelancerId, amount);
            return ResponseEntity.ok(updatedLoan);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{id}/repayment-data")
    public Map<String, Double> getRepaymentData(@PathVariable Long id) {
        Loan loan = loanService.getLoanById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        Map<String, Double> data = new HashMap<>();
        data.put("totalAmount", loan.getAmount());
        data.put("paidAmount", loan.getPaidAmount());
        data.put("remainingAmount", loan.getRemainingAmount());

        return data;
    }

    @Autowired
    private LoanSimulationService simulationService;

    @GetMapping("/simulate")
    public Map<String, String> simulateRepayment(
            @RequestParam double loanAmount,
            @RequestParam double monthlyIncome,
            @RequestParam(defaultValue = "0.3") double repaymentRatio) {
        return simulationService.simulateRepayment(loanAmount, monthlyIncome, repaymentRatio);
    }

    @Autowired
    private LoanPredictionService predictionService;

    @GetMapping("/recommend")
    public ResponseEntity<Map<String, Object>> recommendMaxLoan(@RequestParam double income) {
        try {
            double maxLoanAmount = predictionService.predictMaxLoanAmount(income);
            Map<String, Object> response = new HashMap<>();
            response.put("maxLoanAmount", maxLoanAmount);
            response.put("message", String.format("Based on your income, the maximum loan amount you can take is: $%.2f", maxLoanAmount));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/apply")
    public ResponseEntity<String> applyForLoan(
            @RequestParam double income,
            @RequestParam double requestedAmount) {
        double maxLoanAmount = predictionService.predictMaxLoanAmount(income);

        if (requestedAmount > maxLoanAmount) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: The requested loan amount ($" + requestedAmount + ") exceeds the maximum allowed amount ($" + maxLoanAmount + ").");
        }

        return ResponseEntity.ok("Loan application successful! You have requested: $" + requestedAmount);
    }
}