#!/bin/bash
set -eu

# Set the name of the new user to create.
USERNAME=goodle

# timedatectl list-timezones to list the timezones on the box
TIMEZONE=Europe/London

# Force all output to be presented in en_US for the duration of this script. This avoids # any "setting locale failed" errors while this script is running, before we have
# installed support for all locales. Do not change this setting!
export LC_ALL=en_US.UTF-8

# Update all software packages. Using the --force-confnew flag means that configuration # files will be replaced if newer ones are available.
apt update
apt --yes -o Dpkg::Options::="--force-confnew" upgrade

# Set the system timezone and install all locales.
timedatectl set-timezone ${TIMEZONE} apt --yes install locales-all

# Add the new user (and give them sudo privileges).
useradd --create-home --shell "/bin/bash" --groups sudo "${USERNAME}"

# Configure the firewall to allow SSH, HTTP and HTTPS traffic.
ufw allow 22
ufw allow 80/tcp ufw allow 443/tcp ufw --force enable

# Install fail2ban.
apt --yes install fail2ban

# Install Caddy to do the webforwarding
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

echo "Script complete! Rebooting..." reboot
