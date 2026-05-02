import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Use /tmp directory if running on Vercel (read-only filesystem)
if os.environ.get('VERCEL') or os.environ.get('VERCEL_ENV'):
    DATA_FILE = '/tmp/data.json'
else:
    DATA_FILE = os.path.join(os.path.dirname(__file__), 'data.json')

def read_data():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f)
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def write_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

@app.route('/api/register', methods=['POST'])
def register():
    users = read_data()
    new_user = request.json
    
    if not new_user.get('password') or len(new_user.get('password')) < 8:
        return jsonify({'error': 'Password must be at least 8 characters long.'}), 400
        
    for u in users:
        if u.get('email') == new_user.get('email') or u.get('phone') == new_user.get('phone'):
            return jsonify({'error': 'User with this email or phone already exists'}), 400
            
    users.append(new_user)
    write_data(users)
    
    # Do not return password to client
    user_without_password = {k: v for k, v in new_user.items() if k != 'password'}
    return jsonify({'message': 'Registration successful', 'user': user_without_password}), 201

@app.route('/api/login', methods=['POST'])
def login():
    users = read_data()
    credentials = request.json
    email_or_phone = credentials.get('emailOrPhone')
    password = credentials.get('password')
    
    for u in users:
        if (u.get('email') == email_or_phone or u.get('phone') == email_or_phone) and u.get('password') == password:
            user_without_password = {k: v for k, v in u.items() if k != 'password'}
            return jsonify({'message': 'Login successful', 'user': user_without_password}), 200
            
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/users', methods=['PUT'])
def update_profile():
    users = read_data()
    updated_user = request.json
    old_email = request.headers.get('user-email')
    
    for idx, u in enumerate(users):
        if u.get('email') == old_email:
            # preserve password
            password = u.get('password')
            users[idx] = {**updated_user, 'password': password}
            write_data(users)
            
            user_without_password = {k: v for k, v in users[idx].items() if k != 'password'}
            return jsonify({'message': 'Profile updated', 'user': user_without_password}), 200
            
    return jsonify({'error': 'User not found'}), 404

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3005))
    print(f"Server running at http://localhost:{PORT}")
    app.run(host='0.0.0.0', port=PORT, debug=False)
