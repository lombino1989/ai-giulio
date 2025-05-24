from flask import Flask, request, jsonify
from backend.database import (
    init_db, get_db_connection, populate_trips_from_data,
    get_user_by_email, add_user,
    get_all_trips, get_trip_by_id, add_booking, get_bookings_by_user_id # New DB functions
)
from flask_bcrypt import Bcrypt
from functools import wraps # For token_required decorator
import jwt
import datetime
from datetime import date as dt_date # For date calculations in bookings
from flask import g # For storing user in token_required
import click
import os
import json
import re # For email validation

# Ensure the instance folder exists
instance_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance')
if not os.path.exists(instance_path):
    os.makedirs(instance_path)

app = Flask(__name__)
app.config['DATABASE'] = os.path.join(instance_path, 'travel.db') # Use absolute path for DB
app.config['SECRET_KEY'] = 'your_very_secret_random_string_for_jwt_shhh' # CHANGE FOR PRODUCTION!
bcrypt = Bcrypt(app)


DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'destinazioni.json')

@app.cli.command('init-db')
@click.option('--populate', is_flag=True, help="Populate the database with initial trip data.")
@click.option('--data-file', default=DATA_FILE_PATH, help="Path to the JSON data file for trips.")
def init_db_command(populate, data_file):
    init_db(app) 
    click.echo('Initialized the database.')

    if populate:
        click.echo(f"Attempting to populate trips from {data_file}...")
        try:
            with open(data_file, 'r', encoding='utf-8') as f:
                trips_data = json.load(f)
            
            conn = get_db_connection()
            populate_trips_from_data(conn, trips_data)
            conn.close()
            click.echo(f'Successfully populated trips data from {data_file}.')
        except FileNotFoundError:
            click.echo(f"Error: Data file not found at {data_file}. Please ensure it exists.")
        except json.JSONDecodeError:
            click.echo(f"Error: Could not decode JSON from {data_file}. Please check the file format.")
        except Exception as e:
            click.echo(f"An error occurred during data population: {e}")


@app.route('/')
def hello():
    return "Hello, Travel Agency Backend!"

# --- Token Required Decorator ---
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'error': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            # Store user info in flask.g for access in the route
            # You might want to fetch the full user object from DB here if needed
            g.current_user = {'id': data['user_id'], 'email': data['email'], 'name': data.get('name')}
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid!'}), 401
        except Exception as e:
            return jsonify({'error': f'Token processing error: {str(e)}'}), 401
            
        return f(*args, **kwargs)
    return decorated_function

# --- Authentication API Endpoints ---

EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
MIN_PASSWORD_LENGTH = 6

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON payload'}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'error': 'Missing name, email, or password'}), 400

    if not re.match(EMAIL_REGEX, email):
        return jsonify({'error': 'Invalid email format'}), 400

    if len(password) < MIN_PASSWORD_LENGTH:
        return jsonify({'error': f'Password must be at least {MIN_PASSWORD_LENGTH} characters long'}), 400

    if get_user_by_email(email):
        return jsonify({'error': 'Email already exists'}), 409 # Conflict

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user_id = add_user(name, email, hashed_password)

    if user_id:
        conn = get_db_connection()
        user = conn.execute("SELECT id, name, email FROM users WHERE id = ?", (user_id,)).fetchone()
        conn.close()
        return jsonify({
            'message': 'User registered successfully',
            'user': dict(user) if user else None
        }), 201
    else:
        return jsonify({'error': 'Failed to register user'}), 500


@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON payload'}), 400

    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing email or password'}), 400

    user = get_user_by_email(email) # This returns a Row object or None

    if user and bcrypt.check_password_hash(user['password_hash'], password):
        token_payload = {
            'user_id': user['id'],
            'name': user['name'], 
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        try:
            token = jwt.encode(token_payload, app.config['SECRET_KEY'], algorithm='HS256')
        except Exception as e:
            return jsonify({'error': f'Error generating token: {str(e)}'}), 500
        
        return jsonify({
            'message': 'Login successful',
            'token': token, # In Python 3, this is already a string
            'user': {'id': user['id'], 'name': user['name'], 'email': user['email']}
        }), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401


@app.route('/api/logout', methods=['POST'])
def logout_user():
    return jsonify({'message': 'Logout successful'}), 200


if __name__ == '__main__':
    app.run(debug=True)
