"""
Direct SQL migration to add profile_photo column
"""
import pymysql
from dotenv import load_dotenv
import os

load_dotenv()

# Get database credentials from environment
db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'movie_app')
}

try:
    connection = pymysql.connect(**db_config)
    cursor = connection.cursor()
    
    # Add profile_photo column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN profile_photo VARCHAR(500) DEFAULT NULL")
        connection.commit()
        print("Successfully added profile_photo column!")
    except pymysql.err.OperationalError as e:
        if "Duplicate column name" in str(e):
            print("Column profile_photo already exists")
        else:
            print(f"Error: {e}")
    
    cursor.close()
    connection.close()
    print("Migration completed!")
    
except Exception as e:
    print(f"Database connection error: {e}")
