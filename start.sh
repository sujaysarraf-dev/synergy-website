#!/bin/bash

# Build frontend
echo "Building frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

# Start backend
echo "Starting backend..."
cd backend
python server.py
