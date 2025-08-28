import json
import os

from flask import Flask, jsonify, request
from flask_cors import CORS

from lexical_analyzer import analyze_expression

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    expression = data.get('expression', '')
    
    if not expression:
        return jsonify({'error': 'No expression provided'}), 400
    
    result = analyze_expression(expression)
    return jsonify(result)

@app.route('/api/analyze-file', methods=['POST'])
def analyze_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        content = file.read().decode('utf-8')
        expressions = [line.strip() for line in content.split('\n') if line.strip()]
        
        results = []
        for expression in expressions:
            result = analyze_expression(expression)
            results.append(result)
        
        return jsonify({'results': results})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/examples', methods=['GET'])
def get_examples():
    examples = [
        "3+4*5",
        "a+b*c",
        "x*(y+z)",
        "(a+b)*c",
        "1+2+3+4",
        "1*2*3*4"
    ]
    return jsonify({'examples': examples})

if __name__ == '__main__':
    app.run(debug=True)