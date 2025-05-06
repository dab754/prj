package com.example.loan.service;

import com.example.loan.entity.Freelancer;
import com.example.loan.entity.Loan;
import com.example.loan.entity.LoanStatus;
import com.example.loan.repository.FreelancerRepository;
import com.example.loan.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private FreelancerRepository freelancerRepository;

    @PostConstruct
    public void init() {
        // Check if any freelancers exist
        if (freelancerRepository.count() == 0) {
            // Create a default freelancer
            Freelancer defaultFreelancer = new Freelancer();
            defaultFreelancer.setName("Default Freelancer");
            defaultFreelancer.setEmail("default@example.com");
            defaultFreelancer.setPhoneNumber("1234567890");
            freelancerRepository.save(defaultFreelancer);
            System.out.println("Created default freelancer with ID: " + defaultFreelancer.getId());
        }
    }

    // Get all loans
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    // Get a loan by ID
    public Optional<Loan> getLoanById(Long id) {
        return loanRepository.findById(id);
    }

    // Create a new loan
    public Loan createLoan(Loan loan) {
        if (loan.getFreelancer() == null || loan.getFreelancer().getId() == null) {
            throw new RuntimeException("Freelancer ID is required");
        }

        // Fetch freelancer from the database
        Freelancer freelancer = freelancerRepository.findById(loan.getFreelancer().getId())
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));

        loan.setFreelancer(freelancer);
        loan.setStatus(LoanStatus.PENDING);
        loan.setRequestDate(LocalDate.now());
        loan.setPaidAmount(0.0);
        loan.setRemainingAmount(loan.getAmount());

        // Validate due date
        if (loan.getDueDate() == null || loan.getDueDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Due date must be in the future");
        }

        return loanRepository.save(loan);
    }

    // Update an existing loan
    public Loan updateLoan(Long id, Loan loanDetails) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        // Only allow updating certain fields
        loan.setAmount(loanDetails.getAmount());
        loan.setPurpose(loanDetails.getPurpose());
        loan.setDescription(loanDetails.getDescription());
        loan.setDueDate(loanDetails.getDueDate());
        loan.setStatus(loanDetails.getStatus());

        return loanRepository.save(loan);
    }

    // Delete a loan
    public void deleteLoan(Long id) {
        loanRepository.deleteById(id);
    }

    public List<Loan> getLoanHistory(Long freelancerId, LoanStatus status, LocalDate startDate, LocalDate endDate) {
        Specification<Loan> spec = Specification.where((root, query, cb) -> cb.equal(root.get("freelancer").get("id"), freelancerId));

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (startDate != null && endDate != null) {
            spec = spec.and((root, query, cb) -> cb.between(root.get("requestDate"), startDate, endDate));
        }

        return loanRepository.findAll(spec);
    }

    public Loan makeRepayment(Long loanId, Long freelancerId, double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Repayment amount must be greater than zero");
        }

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        // Verify the freelancer owns the loan
        if (!loan.getFreelancer().getId().equals(freelancerId)) {
            throw new RuntimeException("This loan does not belong to the specified freelancer");
        }

        double newPaidAmount = loan.getPaidAmount() + amount;

        // Prevent overpayment
        if (newPaidAmount > loan.getAmount()) {
            throw new RuntimeException("Repayment amount exceeds loan balance");
        }

        loan.setPaidAmount(newPaidAmount);
        loan.setRemainingAmount(loan.getAmount() - newPaidAmount);

        // Mark loan as completed if fully repaid
        if (loan.getRemainingAmount() == 0) {
            loan.setStatus(LoanStatus.APPROVED);
        }

        return loanRepository.save(loan);
    }
}