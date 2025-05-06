from flask import Flask, request, jsonify
import joblib
import pandas as pd
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Load the trained model
logger.info("Loading the trained model...")
model = joblib.load("loan_model.pkl")
logger.info("Model loaded successfully")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        logger.info("Received prediction request")
        data = request.get_json()
        logger.info(f"Request data: {data}")
        
        if not data or "income" not in data:
            logger.error("Invalid request data: income not provided")
            return jsonify({"error": "Income is required"}), 400
            
        income = data["income"]
        logger.info(f"Processing prediction for income: {income}")
        
        # Create DataFrame with proper feature name
        input_data = pd.DataFrame([[income]], columns=["income"])
        logger.info(f"Input data for prediction: {input_data}")
        
        max_loan_amount = model.predict(input_data)[0]
        logger.info(f"Predicted max_loan_amount: {max_loan_amount}")
        
        response = {"max_loan_amount": float(max_loan_amount)}
        logger.info(f"Sending response: {response}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error processing prediction request: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
