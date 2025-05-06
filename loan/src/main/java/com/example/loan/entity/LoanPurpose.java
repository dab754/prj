package com.example.loan.entity;

public enum LoanPurpose {
    BUSINESS_EXPANSION("Business Expansion"),
    EQUIPMENT_PURCHASE("Equipment Purchase"),
    INVENTORY("Inventory"),
    WORKING_CAPITAL("Working Capital"),
    MARKETING("Marketing"),
    RENT("Rent"),
    UTILITIES("Utilities"),
    SALARY("Salary"),
    OTHER("Other");

    private final String displayName;

    LoanPurpose(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 