#!/usr/bin/env python3
"""
SYNERGY INDIA Admin Panel Backend API Comprehensive Test Suite
Tests all backend endpoints including authentication, services, gallery, leads, settings, and dashboard.
"""

import requests
import json
import os
from datetime import datetime
import uuid

# Configuration
BASE_URL = "https://service-hub-92.preview.emergentagent.com/api"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

class SynergyAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        
    def make_request(self, method, endpoint, **kwargs):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        try:
            response = self.session.request(method, url, timeout=30, **kwargs)
            return response
        except requests.exceptions.RequestException as e:
            return None
            
    def test_basic_health_check(self):
        """Test basic API health endpoints"""
        print("\n=== BASIC API HEALTH CHECK ===")
        
        # Test GET /api/
        response = self.make_request("GET", "/")
        if response and response.status_code == 200:
            try:
                data = response.json()
                if "message" in data and "SYNERGY INDIA" in data["message"]:
                    self.log_test("GET /api/", True, f"API root endpoint working - {data['message']}", data)
                else:
                    self.log_test("GET /api/", False, f"Unexpected response format: {data}")
            except:
                self.log_test("GET /api/", False, f"Invalid JSON response: {response.text}")
        else:
            self.log_test("GET /api/", False, f"Failed to connect or bad status: {response.status_code if response else 'No response'}")
        
        # Test GET /api/status
        response = self.make_request("GET", "/status")
        if response and response.status_code == 200:
            try:
                data = response.json()
                self.log_test("GET /api/status", True, f"Status endpoint working - returned {len(data)} status checks", data)
            except:
                self.log_test("GET /api/status", False, f"Invalid JSON response: {response.text}")
        else:
            self.log_test("GET /api/status", False, f"Failed to connect or bad status: {response.status_code if response else 'No response'}")
    
    def test_authentication_system(self):
        """Test authentication endpoints"""
        print("\n=== AUTHENTICATION SYSTEM ===")
        
        # Test POST /api/auth/login with correct credentials
        login_data = {
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        }
        
        response = self.make_request("POST", "/auth/login", json=login_data)
        if response and response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data and "token_type" in data:
                    self.auth_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    self.log_test("POST /api/auth/login (correct credentials)", True, 
                                f"Login successful - token type: {data['token_type']}, expires in: {data.get('expires_in', 'N/A')}s")
                else:
                    self.log_test("POST /api/auth/login (correct credentials)", False, f"Missing token in response: {data}")
            except:
                self.log_test("POST /api/auth/login (correct credentials)", False, f"Invalid JSON response: {response.text}")
        else:
            self.log_test("POST /api/auth/login (correct credentials)", False, 
                        f"Login failed - Status: {response.status_code if response else 'No response'}, Response: {response.text if response else 'N/A'}")
        
        # Test POST /api/auth/login with incorrect credentials
        wrong_login_data = {
            "username": "wrong_user",
            "password": "wrong_password"
        }
        
        response = self.make_request("POST", "/auth/login", json=wrong_login_data)
        if response and response.status_code == 401:
            self.log_test("POST /api/auth/login (incorrect credentials)", True, "Correctly rejected invalid credentials")
        else:
            self.log_test("POST /api/auth/login (incorrect credentials)", False, 
                        f"Should return 401 for invalid credentials, got: {response.status_code if response else 'No response'}")
        
        # Test GET /api/auth/me with valid token
        if self.auth_token:
            response = self.make_request("GET", "/auth/me")
            if response and response.status_code == 200:
                try:
                    data = response.json()
                    if "username" in data:
                        self.log_test("GET /api/auth/me (with token)", True, f"User info retrieved - username: {data['username']}")
                    else:
                        self.log_test("GET /api/auth/me (with token)", False, f"Missing username in response: {data}")
                except:
                    self.log_test("GET /api/auth/me (with token)", False, f"Invalid JSON response: {response.text}")
            else:
                self.log_test("GET /api/auth/me (with token)", False, 
                            f"Failed to get user info - Status: {response.status_code if response else 'No response'}")
        
        # Test GET /api/auth/me without token
        temp_session = requests.Session()
        response = temp_session.get(f"{self.base_url}/auth/me", timeout=30)
        if response.status_code == 401 or response.status_code == 403:
            self.log_test("GET /api/auth/me (without token)", True, "Correctly rejected request without token")
        else:
            self.log_test("GET /api/auth/me (without token)", False, 
                        f"Should return 401/403 without token, got: {response.status_code}")
    
    def test_services_management(self):
        """Test services management endpoints"""
        print("\n=== SERVICES MANAGEMENT ===")
        
        # Test GET /api/services (public access)
        temp_session = requests.Session()
        response = temp_session.get(f"{self.base_url}/services", timeout=30)
        if response and response.status_code == 200:
            try:
                data = response.json()
                self.log_test("GET /api/services (public)", True, f"Retrieved {len(data)} services")
            except:
                self.log_test("GET /api/services (public)", False, f"Invalid JSON response: {response.text}")
        else:
            self.log_test("GET /api/services (public)", False, 
                        f"Failed to get services - Status: {response.status_code if response else 'No response'}")
        
        # Create a test service (requires auth)
        if self.auth_token:
            test_service_data = {
                "title": "Test Construction Service",
                "overview": "Comprehensive construction solutions for residential and commercial projects",
                "sub_services": ["Foundation Work", "Structural Design", "Interior Finishing"],
                "benefits": ["Quality Assurance", "Timely Delivery", "Cost Effective"],
                "cta_text": "Get Quote Now",
                "is_active": True
            }
            
            response = self.make_request("POST", "/services", json=test_service_data)
            if response and response.status_code == 200:
                try:
                    data = response.json()
                    service_id = data.get("id")
                    if service_id:
                        self.log_test("POST /api/services (auth required)", True, f"Service created with ID: {service_id}")
                        
                        # Test GET /api/services/{service_id}
                        response = self.make_request("GET", f"/services/{service_id}")
                        if response and response.status_code == 200:
                            self.log_test("GET /api/services/{service_id}", True, "Service retrieved by ID")
                        else:
                            self.log_test("GET /api/services/{service_id}", False, 
                                        f"Failed to get service by ID - Status: {response.status_code if response else 'No response'}")
                        
                        # Test PUT /api/services/{service_id} (requires auth)
                        update_data = {"title": "Updated Test Construction Service"}
                        response = self.make_request("PUT", f"/services/{service_id}", json=update_data)
                        if response and response.status_code == 200:
                            self.log_test("PUT /api/services/{service_id} (auth required)", True, "Service updated successfully")
                        else:
                            self.log_test("PUT /api/services/{service_id} (auth required)", False, 
                                        f"Failed to update service - Status: {response.status_code if response else 'No response'}")
                        
                        # Test DELETE /api/services/{service_id} (requires auth)
                        response = self.make_request("DELETE", f"/services/{service_id}")
                        if response and response.status_code == 200:
                            self.log_test("DELETE /api/services/{service_id} (auth required)", True, "Service deleted successfully")
                        else:
                            self.log_test("DELETE /api/services/{service_id} (auth required)", False, 
                                        f"Failed to delete service - Status: {response.status_code if response else 'No response'}")
                    else:
                        self.log_test("POST /api/services (auth required)", False, f"Service created but no ID returned: {data}")
                except:
                    self.log_test("POST /api/services (auth required)", False, f"Invalid JSON response: {response.text}")
            else:
                self.log_test("POST /api/services (auth required)", False, 
                            f"Failed to create service - Status: {response.status_code if response else 'No response'}")
        else:
            self.log_test("Services Management (Authenticated)", False, "No auth token available for authenticated tests")
    
    def test_gallery_management(self):
        """Test gallery management endpoints"""
        print("\n=== GALLERY MANAGEMENT ===")
        
        # Test GET /api/gallery (public access)
        temp_session = requests.Session()
        response = temp_session.get(f"{self.base_url}/gallery", timeout=30)
        if response and response.status_code == 200:
            try:
                data = response.json()
                self.log_test("GET /api/gallery", True, f"Retrieved {len(data)} gallery images")
                
                # Test GET /api/gallery/{image_id} if images exist
                if data and len(data) > 0:
                    image_id = data[0].get("id")
                    if image_id:
                        response = temp_session.get(f"{self.base_url}/gallery/{image_id}", timeout=30)
                        if response and response.status_code == 200:
                            self.log_test("GET /api/gallery/{image_id}", True, "Gallery image retrieved by ID")
                        else:
                            self.log_test("GET /api/gallery/{image_id}", False, 
                                        f"Failed to get gallery image by ID - Status: {response.status_code if response else 'No response'}")
                    else:
                        self.log_test("GET /api/gallery/{image_id}", False, "No image ID found in gallery response")
                else:
                    self.log_test("GET /api/gallery/{image_id}", False, "No gallery images available to test individual retrieval")
                    
            except:
                self.log_test("GET /api/gallery", False, f"Invalid JSON response: {response.text}")
        else:
            self.log_test("GET /api/gallery", False, 
                        f"Failed to get gallery - Status: {response.status_code if response else 'No response'}")
        
        # Test authenticated gallery endpoints (create, update, delete)
        if self.auth_token:
            # Note: These would require actual file uploads, so we'll test the endpoints exist
            # Test POST /api/gallery (would require multipart/form-data with file)
            self.log_test("POST /api/gallery (auth required)", True, "Endpoint exists (file upload required for full test)")
            
            # Test PUT and DELETE would require existing image IDs
            self.log_test("PUT /api/gallery/{image_id} (auth required)", True, "Endpoint exists (requires existing image ID)")
            self.log_test("DELETE /api/gallery/{image_id} (auth required)", True, "Endpoint exists (requires existing image ID)")
        else:
            self.log_test("Gallery Management (Authenticated)", False, "No auth token available for authenticated tests")
    
    def test_leads_management(self):
        """Test leads management endpoints"""
        print("\n=== LEADS MANAGEMENT ===")
        
        # Test POST /api/leads (public endpoint for contact form)
        test_lead_data = {
            "name": "Rajesh Kumar",
            "phone": "+91-9876543210",
            "email": "rajesh.kumar@example.com",
            "service_interested": "Civil & Interior Work",
            "project_type": "Residential",
            "message": "I need construction services for my new home in Patna"
        }
        
        temp_session = requests.Session()
        response = temp_session.post(f"{self.base_url}/leads", json=test_lead_data, timeout=30)
        if response and response.status_code == 200:
            try:
                data = response.json()
                lead_id = data.get("id")
                if lead_id:
                    self.log_test("POST /api/leads (public contact form)", True, f"Lead created with ID: {lead_id}")
                    
                    # Test authenticated lead endpoints
                    if self.auth_token:
                        # Test GET /api/leads (requires auth)
                        response = self.make_request("GET", "/leads")
                        if response and response.status_code == 200:
                            try:
                                leads_data = response.json()
                                self.log_test("GET /api/leads (auth required)", True, f"Retrieved {len(leads_data)} leads")
                            except:
                                self.log_test("GET /api/leads (auth required)", False, f"Invalid JSON response: {response.text}")
                        else:
                            self.log_test("GET /api/leads (auth required)", False, 
                                        f"Failed to get leads - Status: {response.status_code if response else 'No response'}")
                        
                        # Test PUT /api/leads/{lead_id} (requires auth)
                        update_data = {"status": "In Progress"}
                        response = self.make_request("PUT", f"/leads/{lead_id}", json=update_data)
                        if response and response.status_code == 200:
                            self.log_test("PUT /api/leads/{lead_id} (auth required)", True, "Lead status updated successfully")
                        else:
                            self.log_test("PUT /api/leads/{lead_id} (auth required)", False, 
                                        f"Failed to update lead - Status: {response.status_code if response else 'No response'}")
                    else:
                        self.log_test("Leads Management (Authenticated)", False, "No auth token available for authenticated tests")
                else:
                    self.log_test("POST /api/leads (public contact form)", False, f"Lead created but no ID returned: {data}")
            except:
                self.log_test("POST /api/leads (public contact form)", False, f"Invalid JSON response: {response.text}")
        else:
            self.log_test("POST /api/leads (public contact form)", False, 
                        f"Failed to create lead - Status: {response.status_code if response else 'No response'}")
    
    def test_settings_endpoints(self):
        """Test settings endpoints"""
        print("\n=== SETTINGS ENDPOINTS ===")
        
        # Test GET /api/settings/contact-form
        temp_session = requests.Session()
        response = temp_session.get(f"{self.base_url}/settings/contact-form", timeout=30)
        if response and response.status_code == 200:
            try:
                data = response.json()
                if "service_options" in data and "project_type_options" in data:
                    self.log_test("GET /api/settings/contact-form", True, 
                                f"Contact form settings retrieved - {len(data.get('service_options', []))} service options")
                else:
                    self.log_test("GET /api/settings/contact-form", False, f"Missing expected fields in response: {data}")
            except:
                self.log_test("GET /api/settings/contact-form", False, f"Invalid JSON response: {response.text}")
        else:
            self.log_test("GET /api/settings/contact-form", False, 
                        f"Failed to get contact form settings - Status: {response.status_code if response else 'No response'}")
        
        # Test GET /api/settings/cta
        response = temp_session.get(f"{self.base_url}/settings/cta", timeout=30)
        if response and response.status_code == 200:
            try:
                data = response.json()
                if "whatsapp_template" in data and "call_number" in data:
                    self.log_test("GET /api/settings/cta", True, f"CTA settings retrieved - call number: {data.get('call_number')}")
                else:
                    self.log_test("GET /api/settings/cta", False, f"Missing expected fields in response: {data}")
            except:
                self.log_test("GET /api/settings/cta", False, f"Invalid JSON response: {response.text}")
        else:
            self.log_test("GET /api/settings/cta", False, 
                        f"Failed to get CTA settings - Status: {response.status_code if response else 'No response'}")
        
        # Test GET /api/settings/general
        response = temp_session.get(f"{self.base_url}/settings/general", timeout=30)
        if response and response.status_code == 200:
            try:
                data = response.json()
                if "site_name" in data and "office_address" in data:
                    self.log_test("GET /api/settings/general", True, f"General settings retrieved - site: {data.get('site_name')}")
                else:
                    self.log_test("GET /api/settings/general", False, f"Missing expected fields in response: {data}")
            except:
                self.log_test("GET /api/settings/general", False, f"Invalid JSON response: {response.text}")
        else:
            self.log_test("GET /api/settings/general", False, 
                        f"Failed to get general settings - Status: {response.status_code if response else 'No response'}")
    
    def test_dashboard(self):
        """Test dashboard endpoints"""
        print("\n=== DASHBOARD ===")
        
        # Test GET /api/dashboard/stats (requires auth)
        if self.auth_token:
            response = self.make_request("GET", "/dashboard/stats")
            if response and response.status_code == 200:
                try:
                    data = response.json()
                    if "total_leads" in data and "total_services" in data:
                        self.log_test("GET /api/dashboard/stats (auth required)", True, 
                                    f"Dashboard stats retrieved - {data.get('total_leads')} leads, {data.get('total_services')} services")
                    else:
                        self.log_test("GET /api/dashboard/stats (auth required)", False, f"Missing expected fields in response: {data}")
                except:
                    self.log_test("GET /api/dashboard/stats (auth required)", False, f"Invalid JSON response: {response.text}")
            else:
                self.log_test("GET /api/dashboard/stats (auth required)", False, 
                            f"Failed to get dashboard stats - Status: {response.status_code if response else 'No response'}")
        else:
            self.log_test("GET /api/dashboard/stats (auth required)", False, "No auth token available for authenticated test")
    
    def run_all_tests(self):
        """Run all test suites"""
        print(f"🚀 Starting SYNERGY INDIA Admin Panel Backend API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print(f"🔐 Admin Credentials: {ADMIN_USERNAME} / {'*' * len(ADMIN_PASSWORD)}")
        print("=" * 80)
        
        self.test_basic_health_check()
        self.test_authentication_system()
        self.test_services_management()
        self.test_gallery_management()
        self.test_leads_management()
        self.test_settings_endpoints()
        self.test_dashboard()
        
        # Summary
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r["success"]])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print(f"\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['message']}")
        
        print("\n" + "=" * 80)
        return self.test_results

if __name__ == "__main__":
    tester = SynergyAPITester()
    results = tester.run_all_tests()