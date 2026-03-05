"""
Migration script to add profile_photo column to users table
Run this script once to update your existing database
"""
from App.database import engine, Base
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        # Check if column exists
        result = conn.execute(text(
            "SELECT COUNT(*) FROM information_schema.columns "
            "WHERE table_name='users' AND column_name='profile_photo'"
        ))
        
        if result.scalar() == 0:
            # Add profile_photo column
            conn.execute(text(
                "ALTER TABLE users ADD COLUMN profile_photo VARCHAR(500)"
            ))
            conn.commit()
            print("Added profile_photo column to users table")
        else:
            print("profile_photo column already exists")

if __name__ == "__main__":
    migrate()
    print("Migration completed!")
