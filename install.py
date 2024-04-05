import mysql.connector
import os
import re
import subprocess
from dotenv import load_dotenv

def read_table_structure(file_path):
    with open(file_path, 'r') as file:
        sql = file.read()
        tables = re.findall(r'CREATE TABLE `([^`]+)` \((.*?)\)', sql, re.DOTALL)
        return {table[0]: table[1] for table in tables}

def create_table(cursor, table_name, structure):
    cursor.execute(f"CREATE TABLE {table_name} ({structure})")

def alter_table(cursor, table_name, structure):
    # Extract column names from the existing table
    cursor.execute(f"SHOW COLUMNS FROM {table_name}")
    existing_columns = [row[0] for row in cursor.fetchall()]

    # Extract column names from the desired structure
    desired_columns = re.findall(r'`([^`]+)`', structure)

    # Compare and alter table if necessary
    for column in desired_columns:
        if column not in existing_columns:
            cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column}")

def insert_data(cursor, table_name, data):
    for row in data:
        placeholders = ', '.join(['%s'] * len(row))
        columns = ', '.join(row.keys())
        values = tuple(row.values())
        cursor.execute(f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})", values)

def main():
    # Load environment variables from .env file
    load_dotenv()

    # Navigate to tcAdmin directory and update from Git
    subprocess.run(["cd", "/home/netadmin/tcAdmin"])
    subprocess.run(["git", "fetch", "origin"])
    subprocess.run(["git", "reset", "--hard", "origin/main"])

    # Install npm dependencies
    subprocess.run(["npm", "install"])

    # Connect to MySQL using environment variables
    cnx = mysql.connector.connect(
        user=os.getenv("db_user"),
        password=os.getenv("db_password"),
        host=os.getenv("db_host"),
        database=os.getenv("db_database")
    )
    cursor = cnx.cursor()

    # Read table structures from file
    file_path = '/home/netadmin/tcAdmin/tcadmin.sql'  # Adjust path as needed
    table_structures = read_table_structure(file_path)

    for table_name, structure in table_structures.items():
        # Check if table exists
        cursor.execute(f"SHOW TABLES LIKE '{table_name}'")
        if not cursor.fetchone():
            # Table doesn't exist, create it
            create_table(cursor, table_name, structure)
        else:
            # Table exists, alter it if necessary
            alter_table(cursor, table_name, structure)

        # Insert data
        data = []  # You need to define how you want to extract data from your file
        insert_data(cursor, table_name, data)

    cnx.commit()
    cursor.close()
    cnx.close()

if __name__ == "__main__":
    main()
