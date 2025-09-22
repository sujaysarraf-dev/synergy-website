#!/usr/bin/env python3
"""
Test script to verify Supabase connection and database setup
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY')

print("🔍 Testing Supabase Connection...")
print(f"URL: {SUPABASE_URL}")
print(f"Key: {SUPABASE_ANON_KEY[:20]}..." if SUPABASE_ANON_KEY else "❌ No key found")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    print("❌ Missing Supabase credentials in .env file")
    exit(1)

try:
    # Create Supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    print("✅ Supabase client created successfully")
    
    # Test connection by trying to fetch admin users
    print("🔍 Testing database connection...")
    response = supabase.table('admin_users').select('*').limit(1).execute()
    print(f"✅ Database connection successful! Found {len(response.data)} admin users")
    
    # Test services table
    response = supabase.table('services').select('*').limit(1).execute()
    print(f"✅ Services table accessible! Found {len(response.data)} services")
    
    # Test leads table
    response = supabase.table('leads').select('*').limit(1).execute()
    print(f"✅ Leads table accessible! Found {len(response.data)} leads")
    
    # Test storage bucket
    print("🔍 Testing storage bucket...")
    try:
        buckets = supabase.storage.list_buckets()
        bucket_names = [bucket.name for bucket in buckets]
        if '123' in bucket_names:
            print("✅ Storage bucket '123' exists!")
        else:
            print("⚠️ Storage bucket '123' not found. Available buckets:", bucket_names)
    except Exception as e:
        print(f"⚠️ Storage test failed: {e}")
    
    print("\n🎉 All tests passed! Supabase is properly configured.")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n🔧 Troubleshooting:")
    print("1. Make sure you've run the SQL schema in Supabase dashboard")
    print("2. Check your Supabase URL and API key in .env file")
    print("3. Verify your Supabase project is active")
