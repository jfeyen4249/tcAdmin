import subprocess
import datetime
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Database configuration
db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")

# Backup file name with timestamp
backup_file = f"{db_name}_backup_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"

# mysqldump command
command = [
    "mysqldump",
    f"--host={db_host}",
    f"--user={db_user}",
    f"--password={db_password}",
    db_name,
]

# Run the mysqldump command and save to file
with open(backup_file, "w") as output_file:
    result = subprocess.run(command, stdout=output_file, stderr=subprocess.PIPE)

# Check for errors
if result.returncode == 0:
    print(f"Backup successful! Backup file created: {backup_file}")
else:
    print("Error occurred during backup.")
    print(result.stderr.decode("utf-8"))
