#!/usr/bin/env python3
"""Setup database schema for Student Engagement Ecosystem"""

import os
import sys
from pathlib import Path

# Try to use psycopg3 if available, otherwise use subprocess
try:
    import psycopg
except ImportError:
    print("Installing psycopg...")
    os.system("pip install psycopg")
    import psycopg

def setup_database():
    postgres_url = os.getenv("POSTGRES_URL")
    if not postgres_url:
        print("ERROR: POSTGRES_URL environment variable not set")
        sys.exit(1)
    
    script_dir = Path(__file__).parent
    schema_file = script_dir / "001_create_schema.sql"
    trigger_file = script_dir / "002_create_auth_trigger.sql"
    
    try:
        with psycopg.connect(postgres_url) as conn:
            with conn.cursor() as cur:
                # Execute schema creation
                print("Creating database schema...")
                with open(schema_file) as f:
                    schema_sql = f.read()
                
                # Split into statements and execute
                statements = [s.strip() for s in schema_sql.split(';') if s.strip() and not s.strip().startswith('--')]
                
                for i, stmt in enumerate(statements):
                    try:
                        cur.execute(stmt)
                        conn.commit()
                        print(f"✓ Statement {i+1}/{len(statements)} executed")
                    except Exception as e:
                        print(f"✗ Error in statement {i+1}: {e}")
                        conn.rollback()
                
                # Execute trigger creation
                print("\nCreating auth trigger...")
                with open(trigger_file) as f:
                    trigger_sql = f.read()
                
                trigger_statements = [s.strip() for s in trigger_sql.split(';') if s.strip() and not s.strip().startswith('--')]
                
                for i, stmt in enumerate(trigger_statements):
                    try:
                        cur.execute(stmt)
                        conn.commit()
                        print(f"✓ Trigger statement {i+1}/{len(trigger_statements)} executed")
                    except Exception as e:
                        print(f"✗ Error in trigger statement {i+1}: {e}")
                        conn.rollback()
        
        print("\n✓ Database setup completed successfully!")
        
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    setup_database()
