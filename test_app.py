import pytest
import json
import os
import tempfile
import app as flask_app

@pytest.fixture
def client():
    # Create a temporary JSON file for testing to protect real data.json
    fd, temp_path = tempfile.mkstemp(suffix='.json')
    with open(temp_path, 'w') as f:
        json.dump([], f)
        
    # Override the DATA_FILE path in the app module
    original_data_file = flask_app.DATA_FILE
    flask_app.DATA_FILE = temp_path
    
    flask_app.app.config['TESTING'] = True
    with flask_app.app.test_client() as client:
        yield client
        
    # Teardown: Restore original file path and delete temp file
    flask_app.DATA_FILE = original_data_file
    os.close(fd)
    os.remove(temp_path)


def test_index_route(client):
    """Test if the main HTML page serves correctly"""
    response = client.get('/')
    assert response.status_code == 200
    assert b'<!DOCTYPE html>' in response.data


def test_register_success(client):
    """Test successful user registration"""
    new_user = {
        "name": "Test User",
        "email": "testuser@example.com",
        "phone": "1234567890",
        "password": "strongpassword"
    }
    response = client.post('/api/register', json=new_user)
    assert response.status_code == 201
    
    data = response.get_json()
    assert data['message'] == 'Registration successful'
    assert data['user']['email'] == 'testuser@example.com'
    assert 'password' not in data['user'] # Ensure password is not returned


def test_register_short_password(client):
    """Test registration fails with a short password"""
    new_user = {
        "name": "Test User",
        "email": "testuser2@example.com",
        "phone": "0987654321",
        "password": "short"
    }
    response = client.post('/api/register', json=new_user)
    assert response.status_code == 400
    
    data = response.get_json()
    assert 'Password must be at least 8 characters long' in data['error']


def test_register_duplicate_email(client):
    """Test registration fails when email already exists"""
    new_user = {
        "name": "Test User",
        "email": "duplicate@example.com",
        "phone": "1111111111",
        "password": "strongpassword"
    }
    client.post('/api/register', json=new_user)
    
    # Try to register same email again
    response = client.post('/api/register', json=new_user)
    assert response.status_code == 400
    assert 'already exists' in response.get_json()['error']


def test_login_success(client):
    """Test login succeeds with correct credentials"""
    # 1. Register
    client.post('/api/register', json={
        "name": "Login User",
        "email": "login@example.com",
        "phone": "2222222222",
        "password": "validpassword123"
    })
    
    # 2. Login
    response = client.post('/api/login', json={
        "emailOrPhone": "login@example.com",
        "password": "validpassword123"
    })
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['message'] == 'Login successful'
    assert data['user']['name'] == 'Login User'


def test_login_failure(client):
    """Test login fails with incorrect credentials"""
    response = client.post('/api/login', json={
        "emailOrPhone": "wrong@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert response.get_json()['error'] == 'Invalid credentials'
