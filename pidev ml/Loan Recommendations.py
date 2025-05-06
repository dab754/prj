import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import joblib
from faker import Faker

# Generate fake data
def generate_fake_data(size=1000):
    fake = Faker()
    data = []
    for _ in range(size):
        income = fake.random_int(min=1000, max=10000)
        existing_liabilities = income * 0.1  # Assume 10% of income
        max_loan_amount = (income * 0.4) - existing_liabilities  # Professional formula
        data.append([income, max_loan_amount])
    return pd.DataFrame(data, columns=["income", "max_loan_amount"])

# Train the model
def train_model(data):
    X = data[["income"]]
    y = data["max_loan_amount"]
    model = LinearRegression()
    model.fit(X, y)
    return model

# Save the model
def save_model(model, filename="loan_model.pkl"):
    joblib.dump(model, filename)

# Main function
if __name__ == "__main__":
    # Generate fake data
    data = generate_fake_data()

    # Train the model
    model = train_model(data)

    # Save the model
    save_model(model)
    print("Model trained and saved as 'loan_model.pkl'")
