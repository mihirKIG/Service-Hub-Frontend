#!/bin/bash

# ServiceHub Frontend - VPS Deploy Script
# Run this on VPS manually if needed

DEPLOY_DIR="/var/www/frontend"
BACKUP_DIR="/var/www/frontend/dist-backup"
DIST_DIR="/var/www/frontend/dist"

echo "=== ServiceHub Frontend Deployment ==="

# Create directories
mkdir -p "$DEPLOY_DIR"
mkdir -p "$DIST_DIR"

# Backup current version
if [ -d "$DIST_DIR" ]; then
    echo "Backing up current version..."
    rm -rf "$BACKUP_DIR"
    mv "$DIST_DIR" "$BACKUP_DIR"
    mkdir -p "$DIST_DIR"
fi

echo "Deployment directory ready: $DEPLOY_DIR"
echo "Next: Copy your build files (dist/) to $DIST_DIR"
echo ""

# After copying files, run:
# sudo chown -R www-data:www-data /var/www/frontend/dist
# sudo chmod -R 755 /var/www/frontend/dist
# sudo nginx -t && sudo systemctl reload nginx
