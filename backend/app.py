from flask import Flask
from flask_cors import CORS
from flask import Flask, request, jsonify
from data_loader import load_data
from recommender import recommend_jobs

app = Flask(__name__)
CORS(app)

# Load dataset once
data, tfidf_matrix, tfidf = load_data()

@app.route('/api/get_job_types', methods=['POST'])
def get_job_types():
    job_title = request.json['jobTitle']
    df = data[data['Job Title'].str.contains(job_title, case=False)]
    return jsonify({'jobTypes': df['Work Type'].unique().tolist()})

@app.route('/api/get_salary_options', methods=['POST'])
def get_salary_options():
    job_title = request.json['jobTitle']
    work_type = request.json['workType']
    df = data[
        (data['Job Title'].str.contains(job_title, case=False)) &
        (data['Work Type'] == work_type)
    ]
    return jsonify({'salaryOptions': sorted(df['salary_inr'].unique().tolist())})

@app.route('/api/get_recommendations', methods=['POST'])
def get_recommendations():
    req = request.json
    salary_str = str(req['salary'])
    salary = int(salary_str.replace(',', ''))
    jobs = recommend_jobs(
        data,
        tfidf_matrix,
        tfidf,
        req['jobTitle'],
        req['workTypes'],
        salary
    )
    return jsonify({'jobs': jobs})

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
