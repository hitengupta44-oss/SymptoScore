from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import google.generativeai as genai

# Add parent directory to path to import sympto_lib
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sympto_lib import initialize_models, process_user_input

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyB77G41o1-mY0dS-eRuCHnxmF3cYT9ssMI"
genai.configure(api_key=GEMINI_API_KEY)

# List available models and pick one
print("Finding available Gemini models...")
available_models = []
for m in genai.list_models():
    # supported_generation_methods can be a list of strings or objects with .name
    methods = m.supported_generation_methods
    if methods:
        method_names = [method if isinstance(method, str) else method.name for method in methods]
        if 'generateContent' in method_names:
            available_models.append(m.name)
            print(f"  - {m.name}")

# Use first available model
if available_models:
    model_name = available_models[0]
    print(f"Using model: {model_name}")
    gemini_model = genai.GenerativeModel(model_name)
else:
    print("WARNING: No Gemini models available!")
    gemini_model = None

# Initialize models on startup
print("Initializing ML models...")
initialize_models()
print("Models initialized successfully!")

def generate_ai_summary(report, user_responses, age):
    """Generate AI summary using Gemini API."""
    if gemini_model is None:
        return "AI analysis unavailable: No Gemini models found"
    
    try:
        print("Generating AI summary...")
        
        # Build a prompt with the report data
        diseases_info = []
        for item in report:
            diseases_info.append(f"- {item['disease']}: {item['risk']}% risk ({item['risk_band']})")
        
        prompt = f"""You are a helpful medical AI assistant. Based on the following health screening results, provide a brief, empathetic summary and actionable advice.

Patient Age: {age}

Health Risk Assessment:
{chr(10).join(diseases_info)}

User's reported symptoms/lifestyle factors:
{', '.join([f"{k}: {v}" for k, v in user_responses.items()])}

Please provide:
1. A brief overall health summary (2-3 sentences)
2. Top 3 actionable recommendations
3. When to see a doctor (if applicable)

Keep the response concise, friendly, and encouraging. Do NOT diagnose - this is a screening tool only.
"""
        
        print("Calling Gemini API...")
        response = gemini_model.generate_content(prompt)
        print(f"Gemini response received!")
        return response.text
    except Exception as e:
        print(f"Gemini API error: {e}")
        import traceback
        traceback.print_exc()
        return f"AI analysis unavailable: {str(e)}"

@app.route('/api/analyze', methods=['POST'])
def api_analyze():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"status": "error", "error": "No JSON data provided"}), 400
        
        age = data.get('age')
        if age is None:
            return jsonify({"status": "error", "error": "Age is required"}), 400
        
        try:
            age = int(age)
        except ValueError:
            return jsonify({"status": "error", "error": "Age must be a valid integer"}), 400
        
        user_responses = {k: v for k, v in data.items() if k != 'age'}
        
        if not user_responses:
            return jsonify({"status": "error", "error": "At least one question response is required"}), 400
        
        # Process and get risk report
        report = process_user_input(age, user_responses)
        
        # Generate AI summary using Gemini
        ai_summary = generate_ai_summary(report, user_responses, age)
        
        return jsonify({
            "status": "success",
            "report": report,
            "ai_summary": ai_summary
        })
    
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
