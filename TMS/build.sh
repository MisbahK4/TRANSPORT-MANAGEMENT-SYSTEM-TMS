#!/usr/bin/env bash
set -o errexit  

# Install backend dependencies
pip install -r requirements.txt

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Move React build into Django static files
mkdir -p backend/static
cp -r frontend/dist/* backend/static/

# Collect Django static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate
