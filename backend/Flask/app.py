from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add parent directory to path to import sympto_lib
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sympto_lib import initialize_models, process_user_input

app = Flask(__name__)
CORS(app)

# Initialize models on startup
print("Initializing models...")
initialize_models()
print("Models initialized successfully!")

@app.route('/api/analyze', methods=['POST'])
def api_analyze():
    """
    Single POST endpoint for health risk analysis.
    
    Request Body:
    {
        "age": 35,
        "BloodPressure": "High",
        "SugarLevel": "Normal",
        "Smoking": "Yes",
        ...
    }
    
    Response:
    {
        "status": "success",
        "report": [...]
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"status": "error", "error": "No JSON data provided"}), 400
        
        # Extract age
        age = data.get('age')
        if age is None:
            return jsonify({"status": "error", "error": "Age is required"}), 400
        
        try:
            age = int(age)
        except ValueError:
            return jsonify({"status": "error", "error": "Age must be a valid integer"}), 400
        
        # All other fields are responses
        user_responses = {k: v for k, v in data.items() if k != 'age'}
        
        if not user_responses:
            return jsonify({"status": "error", "error": "At least one question response is required"}), 400
        
        # Process and return results
        report = process_user_input(age, user_responses)
        
        return jsonify({
            "status": "success",
            "report": report
        })
    
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
