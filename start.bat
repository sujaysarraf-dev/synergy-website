@echo off

echo Building frontend...
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

echo Starting backend...
cd backend
python server.py
