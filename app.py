import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'data.json')

TMP_DB_PATH = '/tmp/data.json'
_MEMORY_DB = None

def load_db():
    global _MEMORY_DB
    if os.path.exists(TMP_DB_PATH):
        try:
            with open(TMP_DB_PATH, 'r') as f: return json.load(f)
        except: pass
    if _MEMORY_DB is not None: return _MEMORY_DB
    try:
        if os.path.exists(DB_PATH):
            with open(DB_PATH, 'r') as f: _MEMORY_DB = json.load(f)
        else: _MEMORY_DB = []
    except: _MEMORY_DB = []
    return _MEMORY_DB

def save_db(data):
    global _MEMORY_DB
    _MEMORY_DB = data
    try:
        with open(TMP_DB_PATH, 'w') as f: json.dump(data, f, indent=2)
    except: pass
    try:
        with open(DB_PATH, 'w') as f: json.dump(data, f, indent=2)
    except: pass

@app.route('/api/register/', methods=['POST'])
def register():
    db = load_db()
    data = request.json
    email = data.get('email', '').lower()
    password = data.get('password', '')
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters long'}), 400
    if any(u['email'].lower() == email for u in db):
        return jsonify({'error': 'User already exists'}), 400
    user = {
        'name': data.get('name'),
        'email': email,
        'phone': data.get('phone'),
        'password': data.get('password')
    }
    db.append(user)
    save_db(db)
    return jsonify({'user': {k:v for k,v in user.items() if k != 'password'}}), 201

@app.route('/api/login/', methods=['POST'])
def login():
    db = load_db()
    data = request.json
    login_id = data.get('emailOrPhone', '').lower()
    for u in db:
        if (u['email'].lower() == login_id or u.get('phone') == login_id) and u['password'] == data.get('password'):
            return jsonify({'user': {k:v for k,v in u.items() if k != 'password'}}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/profile/', methods=['PUT'])
def update_profile():
    db = load_db()
    data = request.json
    old_email = request.headers.get('user-email', '').lower()
    for idx, u in enumerate(db):
        if u['email'].lower() == old_email:
            # Update fields but preserve critical ones
            pw = u['password']
            db[idx] = {**data, 'password': pw}
            save_db(db)
            return jsonify({'user': {k:v for k,v in db[idx].items() if k != 'password'}}), 200
    return jsonify({'error': 'User not found'}), 404

@app.route('/')
def index(): return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3005, debug=False)
