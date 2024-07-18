#!/bin/bash

# Set variables
# Your local username on the server
USERNAME="netadmin"
DB_ROOT_PASSWORD="" 
DB_USER="tcadmin"
DB_USER_PASSWORD="password"
GITHUB_REPO="https://github.com/jfeyen4249/tcAdmin.git"
TIMEZONE="America/Chicago"
#Your domain of server IP address
DOMAIN="docs.myschool.k12.wi.us"

# Update and install necessary packages
sudo apt update -y
sudo apt upgrade -y
sudo apt install -y openssh-server nodejs npm nginx mysql-server python3 python3-requests git python3-pip

# Set timezone
sudo timedatectl set-timezone $TIMEZONE
date

# Check node version and update if necessary
NODE_VERSION=$(node -v)
if [[ "$NODE_VERSION" < "v18" ]]; then
    sudo npm install -g n
    sudo n stable
    sudo reboot
fi

# Clone the tcAdmin repository
git clone $GITHUB_REPO /home/$USERNAME/tcAdmin
cd /home/$USERNAME/tcAdmin

# Setup MySQL
sudo mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$DB_ROOT_PASSWORD';"
sudo mysql -u root -p$DB_ROOT_PASSWORD -e "CREATE DATABASE tcadmin;"
sudo mysql -u root -p$DB_ROOT_PASSWORD -e "CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_USER_PASSWORD';"
sudo mysql -u root -p$DB_ROOT_PASSWORD -e "GRANT ALL ON tcadmin.* TO '$DB_USER'@'localhost' WITH GRANT OPTION;"
sudo mysql -u $DB_USER -p$DB_USER_PASSWORD tcadmin < /home/$USERNAME/tcAdmin/db.sql

# Setup tcAdmin
cd /home/$USERNAME/tcAdmin
python3 key.py
sudo nano .env

# Install npm dependencies
npm install

# Setup PM2
sudo npm install pm2@latest -g
pm2 start app.js --watch
pm2 status
pm2 startup systemd -u $USERNAME --hp /home/$USERNAME
pm2 save

# Generate SSL certificates
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/localhost.key -out /etc/ssl/certs/localhost.crt

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
sudo systemctl restart nginx

# Setup cron jobs for network monitoring and renewal reminders
(crontab -l 2>/dev/null; echo "* * * * * /usr/bin/env python3 /home/$USERNAME/tcAdmin/tools/monitor.py") | sudo crontab -
(crontab -l 2>/dev/null; echo "45 6 * * * /usr/bin/env python3 /home/$USERNAME/tcAdmin/tools/renewal.py") | sudo crontab -

echo "TcAdmin setup completed. You can now access the site."
echo "Login with Username: tcadmin, Password: P@$$Word (You will be prompted to change the password upon first login)"
