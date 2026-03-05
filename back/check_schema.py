import pymysql
from dotenv import load_dotenv
import os

load_dotenv()

db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'movie_app')
}

connection = pymysql.connect(**db_config)
cursor = connection.cursor()

cursor.execute("DESCRIBE users")
columns = cursor.fetchall()

print("Current users table structure:")
for col in columns:
    print(f"  {col[0]} - {col[1]}")

cursor.close()
connection.close()
