import sqlite3
import json

DATABASE_NAME = 'instance/travel.db'

def get_db_connection():
    """Establishes a connection to the SQLite database."""
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row  # Access columns by name
    return conn

def create_tables(conn):
    """Creates the database tables if they don't already exist."""
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        country TEXT,
        description TEXT,
        long_description TEXT,
        image_url TEXT,
        rating REAL,
        tags TEXT,
        best_time_to_visit TEXT,
        attractions TEXT,
        price_per_night REAL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        trip_id TEXT NOT NULL,
        check_in_date TEXT NOT NULL,
        check_out_date TEXT NOT NULL,
        travelers INTEGER NOT NULL,
        total_price REAL NOT NULL,
        booking_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'confirmed',
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (trip_id) REFERENCES trips (id)
    );
    """)
    conn.commit()

def populate_trips_from_data(conn, data):
    """
    Populates the trips table from a list of trip objects.
    The 'data' parameter is expected to be a list of dictionaries,
    where each dictionary represents a trip.
    Tags and attractions can be lists (will be stored as JSON strings)
    or comma-separated strings.
    """
    cursor = conn.cursor()
    for trip in data:
        tags_to_store = json.dumps(trip.get('tags')) if isinstance(trip.get('tags'), list) else trip.get('tags')
        attractions_to_store = json.dumps(trip.get('attractions')) if isinstance(trip.get('attractions'), list) else trip.get('attractions')
        
        cursor.execute("""
            INSERT INTO trips (
                id, name, country, description, long_description, image_url,
                rating, tags, best_time_to_visit, attractions, price_per_night
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO NOTHING; 
        """, (
            trip['id'], trip['name'], trip.get('country'), trip.get('description'),
            trip.get('longDescription'), trip.get('imageUrl'), trip.get('rating'),
            tags_to_store, trip.get('bestTimeToVisit'),
            attractions_to_store, trip.get('pricePerNight')
        ))
    conn.commit()
    print(f"Populated/updated {len(data)} trips.")

# User management helper functions
def get_user_by_email(email):
    """Fetches a user by their email address."""
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()
    return user

def add_user(name, email, password_hash):
    """Adds a new user to the database."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (name, email, password_hash)
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return user_id
    except sqlite3.IntegrityError: # Handles email uniqueness constraint
        conn.close()
        return None

# Trip management helper functions
def get_all_trips():
    """Fetches all trips from the database."""
    conn = get_db_connection()
    trips_cursor = conn.execute("SELECT * FROM trips").fetchall()
    trips = []
    for trip_row in trips_cursor:
        trip = dict(trip_row)
        try:
            trip['tags'] = json.loads(trip_row['tags']) if trip_row['tags'] else []
        except json.JSONDecodeError:
            trip['tags'] = trip_row['tags'].split(',') if trip_row['tags'] else [] # Fallback for comma-separated
        try:
            trip['attractions'] = json.loads(trip_row['attractions']) if trip_row['attractions'] else []
        except json.JSONDecodeError:
            trip['attractions'] = trip_row['attractions'].split(',') if trip_row['attractions'] else [] # Fallback
        trips.append(trip)
    conn.close()
    return trips

def get_trip_by_id(trip_id):
    """Fetches a single trip by its ID."""
    conn = get_db_connection()
    trip_row = conn.execute("SELECT * FROM trips WHERE id = ?", (trip_id,)).fetchone()
    conn.close()
    if trip_row:
        trip = dict(trip_row)
        try:
            trip['tags'] = json.loads(trip_row['tags']) if trip_row['tags'] else []
        except json.JSONDecodeError:
            trip['tags'] = trip_row['tags'].split(',') if trip_row['tags'] else []
        try:
            trip['attractions'] = json.loads(trip_row['attractions']) if trip_row['attractions'] else []
        except json.JSONDecodeError:
            trip['attractions'] = trip_row['attractions'].split(',') if trip_row['attractions'] else []
        return trip
    return None

# Booking management helper functions
def add_booking(user_id, trip_id, check_in_date, check_out_date, travelers, total_price):
    """Adds a new booking to the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO bookings (user_id, trip_id, check_in_date, check_out_date, travelers, total_price, status)
        VALUES (?, ?, ?, ?, ?, ?, 'confirmed')
    """, (user_id, trip_id, check_in_date, check_out_date, travelers, total_price))
    conn.commit()
    booking_id = cursor.lastrowid
    conn.close()
    return booking_id

def get_bookings_by_user_id(user_id):
    """Fetches all bookings for a given user_id, including trip details."""
    conn = get_db_connection()
    # Join bookings with trips to get trip_name and trip_image_url
    bookings_cursor = conn.execute("""
        SELECT b.*, t.name as trip_name, t.image_url as trip_image_url
        FROM bookings b
        JOIN trips t ON b.trip_id = t.id
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC
    """, (user_id,)).fetchall()
    bookings = [dict(row) for row in bookings_cursor]
    conn.close()
    return bookings


def init_db(app=None): # app parameter is optional for now, might be used for Flask specific context later
    """Initializes the database: creates tables and can populate initial data."""
    conn = get_db_connection()
    create_tables(conn)
    
    print("Database tables created.")
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized directly via script.")
    conn = get_db_connection()
    example_data = [
       {
           "id": "bali", "name": "Bali", "country": "Indonesia",
           "description": "L'isola degli dei...",
           "longDescription": "Bali, conosciuta come...", 
           "imageUrl": "https://picsum.photos/seed/bali/800/600",
           "rating": 4.8, "tags": ["spiaggia", "cultura", "natura"],
           "bestTimeToVisit": "Maggio - Settembre",
           "attractions": ["Templi", "Risaie"], "pricePerNight": 120
       }
    ]
    populate_trips_from_data(conn, example_data)
    conn.close()
    print("Example data populated.")
