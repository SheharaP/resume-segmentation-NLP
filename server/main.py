from bson import ObjectId
from flask_cors import CORS
from flask import Flask, request, jsonify
from datetime import timedelta
from flask_jwt_extended import JWTManager, create_access_token, verify_jwt_in_request, jwt_required, get_jwt_identity
import re

from Resume import Resume
from User import User
from Database import Database

app = Flask(__name__)
CORS(app)

app.config[
    'JWT_SECRET_KEY'] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=3600)

jwt = JWTManager(app)
mongodb = Database(app)


@app.route('/process-resume', methods=['POST'])
@jwt_required()
def process_resumes():
    try:
        verify_jwt_in_request()
        get_jwt_identity()

        uploaded_files = request.files.getlist('files')
        results = []
        if not uploaded_files:
            return jsonify({'error': 'No files uploaded.'}), 400
        for file in uploaded_files:
            print(file)
            resume = Resume.process_uploaded_file(file)
            if resume is not None:
                results.append(resume.get_filtered_data())
        print(results)

        mongodb.insert_many('resumes', results)

        for result in results:
            result['_id'] = str(result['_id'])
        return jsonify(results)

    except Exception as e:
        print(f"Error processing resumes: {str(e)}")
        return jsonify({'error': 'Error processing resumes'}), 500


@app.route('/get-resumes', methods=['GET'])
@jwt_required()
def get_resumes():
    try:
        verify_jwt_in_request()

        current_user = get_jwt_identity()
        print(current_user)

        all_resumes = list(mongodb.find_all('resumes'))

        for resume in all_resumes:
            resume['_id'] = str(resume['_id'])
    except Exception as e:
        print(f"Error getting the resumes: {str(e)}")

    return all_resumes


@app.route('/search-resumes', methods=['GET'])
@jwt_required()
def search_resumes():
    matching_resumes = []
    try:
        verify_jwt_in_request()

        current_user = get_jwt_identity()
        print(current_user)

        params_skills = request.args.get('skills')
        params_designation = request.args.get('designation')

        matching_resumes = filter_resumes(params_skills, params_designation)

    except Exception as e:
        print(f"Error filtering skills: {str(e)}")

    return matching_resumes


def filter_resumes(skills, designation):
    filter_query = {}

    if skills is not None and skills != 'null':
        skills_to_find = skills.split(',')
        filter_query["skills"] = {"$in": skills_to_find}

    if designation is not None and designation != 'null':
        designation_to_find = designation.split(',')
        filter_query["designation"] = {"$in": designation_to_find}

    print(filter_query)

    matching_resumes = mongodb.find_all('resumes', filter_query)

    for resume in matching_resumes:
        resume['_id'] = str(resume['_id'])

    return matching_resumes

@app.route('/delete-resume', methods=['DELETE'])
@jwt_required()
def delete_resume():
    try:
        verify_jwt_in_request()

        resume_id = request.args.get('resumeId')

        print(resume_id)

        if not resume_id:
            return "Missing jobId in request", 400

        current_user = get_jwt_identity()
        print(current_user)

        result = mongodb.delete_one('resumes', {'_id': ObjectId(resume_id)})

        if result.deleted_count == 1:
            return "Resume deleted successfully", 200
        else:
            return "Resume not found or already deleted", 404

    except Exception as e:
        print(f"Error deleting Resume: {str(e)}")
        return "Error deleting Resume", 500

@app.route('/add-job', methods=['POST'])
@jwt_required()
def add_job():
    try:
        verify_jwt_in_request()

        current_user = get_jwt_identity()
        print(current_user)

        job_data = request.get_json()
        print(job_data)
        inserted_job = mongodb.insert_one('jobs', job_data)
        print(f"Job added with ID: {inserted_job.inserted_id}")

        return "Job added successfully"
    except Exception as e:
        print(f"Error adding job: {str(e)}")
        return "Error adding job", 500


@app.route('/get-jobs', methods=['GET'])
@jwt_required()
def get_jobs():
    try:
        verify_jwt_in_request()

        current_user = get_jwt_identity()
        print(current_user)

        all_jobs = mongodb.find_all('jobs')

        for job in all_jobs:
            job['_id'] = str(job['_id'])
        return all_jobs

    except Exception as e:
        print(f"Error getting jobs: {str(e)}")
        return "Error getting jobs", 500


@app.route('/delete-job', methods=['DELETE'])
@jwt_required()
def delete_job():
    try:
        verify_jwt_in_request()

        job_id = request.args.get('jobId')

        print(job_id)

        if not job_id:
            return "Missing jobId in request", 400

        current_user = get_jwt_identity()
        print(current_user)

        result = mongodb.delete_one('jobs', {'_id': ObjectId(job_id)})

        if result.deleted_count == 1:
            return "Job deleted successfully", 200
        else:
            return "Job not found or already deleted", 404

    except Exception as e:
        print(f"Error deleting job: {str(e)}")
        return "Error deleting job", 500


@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        company_name = data.get('companyName')  # Corrected field name
        email = data.get('email')
        password = data.get('password')

        existing_user = mongodb.find_one('users', {"email": email})
        if existing_user:
            return jsonify({"message": "User with this email already exists"}), 400

        # Create a new user
        new_user = User(company_name, email, password)
        user_data = {
            "company_name": new_user.company_name,
            "email": new_user.email,
            "password": new_user.password
        }
        mongodb.insert_one('users', user_data)
        return jsonify({"message": "User added successfully"}), 200

    except Exception as e:
        print(f"Error adding user: {str(e)}")
        return jsonify({"message": "Internal Server Error"}), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        input_password = data.get('password')

        user_data = mongodb.find_one('users', {"email": email})
        if not user_data:
            return jsonify({"message": "User not found"}), 404

        if User.validate_password(user_data['password'], input_password):
            access_token = create_access_token(identity=email)
            response = {
                "message": "Login successful",
                "token": access_token
            }
            return response
        else:
            return jsonify({"message": "Invalid password"}), 401

    except Exception as e:
        print(f"Error during login: {str(e)}")
        return jsonify({"message": "Internal Server Error"}), 500


@app.route('/match-resumes', methods=['GET'])
@jwt_required()
def match_resumes():
    try:
        verify_jwt_in_request()
        get_jwt_identity()

        params = request.args.get('jobTitle')

        job_data = list(mongodb.find_all('jobs', {"jobTitle": params}))

        job_skills = []
        job_experience = 0

        for job in job_data:
            job_skills = job.get('jobSkills', [])
            experience_str = job.get('jobExperience', '0 years')
            numeric_part = int(re.search(r'\d+', experience_str).group())
            job_experience = str(numeric_part)

        if not isinstance(job_skills, list):
            job_skills = [skill.strip() for skill in job_skills.strip('[]').split(',')]

        matching_resumes = list(mongodb.find_all('resumes', {
            "experience": {"$gte": job_experience},
            "skills": {"$in": job_skills},
        }))

        for resume in matching_resumes:
            resume['_id'] = str(resume['_id'])

        return jsonify(matching_resumes)

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/protected', methods=['GET'])
@jwt_required
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
