from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import hashlib
import jwt
import aiofiles
import shutil
from PIL import Image
import io
import base64


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_ANON_KEY = os.environ['SUPABASE_ANON_KEY']
SUPABASE_STORAGE_BUCKET = os.environ['SUPABASE_STORAGE_BUCKET']

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'synergy-india-secret-key')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Security
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI(title="SYNERGY INDIA Admin API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============================================================================
# PYDANTIC MODELS
# ============================================================================

# Authentication Models
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: Optional[datetime] = None

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

# Service Models
class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    short_intro: Optional[str] = None
    overview: str
    sub_services: List[str]
    benefits: List[str]
    cta_text: str
    images: List[str] = []
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ServiceCreate(BaseModel):
    title: str
    short_intro: Optional[str] = None
    overview: str
    sub_services: List[str]
    benefits: List[str]
    cta_text: str
    is_active: bool = True

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    short_intro: Optional[str] = None
    overview: Optional[str] = None
    sub_services: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    cta_text: Optional[str] = None
    is_active: Optional[bool] = None

# Gallery Models
class GalleryImage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    alt_text: str
    caption: str
    category: str
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GalleryImageCreate(BaseModel):
    alt_text: str
    caption: str
    category: str
    order: int = 0
    is_active: bool = True

class GalleryImageUpdate(BaseModel):
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

# Lead Models
class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[EmailStr] = None
    service_interested: str
    project_type: str
    message: Optional[str] = None
    status: str = "New"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeadCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    service_interested: str
    project_type: str
    message: Optional[str] = None

class LeadUpdate(BaseModel):
    status: Optional[str] = None

# Contact Form Settings Models
class ContactFormSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service_options: List[str]
    project_type_options: List[str]
    admin_email: EmailStr
    whatsapp_number: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactFormSettingsUpdate(BaseModel):
    service_options: Optional[List[str]] = None
    project_type_options: Optional[List[str]] = None
    admin_email: Optional[EmailStr] = None
    whatsapp_number: Optional[str] = None

# CTA Settings Models
class CTASettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    whatsapp_template: str
    call_number: str
    contact_page_link: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CTASettingsUpdate(BaseModel):
    whatsapp_template: Optional[str] = None
    call_number: Optional[str] = None
    contact_page_link: Optional[str] = None

# General Settings Models
class GeneralSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    site_name: str
    logo_url: str
    office_address: str
    phone: str
    email: EmailStr
    office_hours: str
    social_media: Dict[str, str]
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GeneralSettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    logo_url: Optional[str] = None
    office_address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    office_hours: Optional[str] = None
    social_media: Optional[Dict[str, str]] = None

# Dashboard Stats Model
class DashboardStats(BaseModel):
    total_leads: int
    today_enquiries: int
    total_services: int
    total_gallery_images: int
    recent_leads: List[Lead]

# Login History Model  
class LoginHistory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    login_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    success: bool = True

# Legacy models for backward compatibility
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def create_access_token(data: dict):
    """Create JWT access token"""
    to_encode = data.copy()
    to_encode.update({"exp": datetime.now(timezone.utc).timestamp() + (ACCESS_TOKEN_EXPIRE_MINUTES * 60)})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        # Check if user exists in Supabase
        response = supabase.table('admin_users').select('*').eq('username', username).execute()
        if not response.data:
            raise HTTPException(status_code=401, detail="User not found")
        
        user_data = response.data[0]
        return AdminUser(**user_data)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

async def upload_to_supabase_storage(file: UploadFile, directory: str = "general") -> str:
    """Upload file to Supabase storage and return URL"""
    if file.size > 1024 * 1024:  # 1MB limit
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 1MB")
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = f"{directory}/{filename}"
    
    # Read file content
    content = await file.read()
    
    # Upload to Supabase storage
    try:
        response = supabase.storage.from_(SUPABASE_STORAGE_BUCKET).upload(file_path, content)
        if response.get('error'):
            raise HTTPException(status_code=500, detail=f"Upload failed: {response['error']}")
        
        # Get public URL
        public_url = supabase.storage.from_(SUPABASE_STORAGE_BUCKET).get_public_url(file_path)
        return public_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(admin_login: AdminLogin):
    """Admin login endpoint"""
    # Check if user exists in Supabase
    response = supabase.table('admin_users').select('*').eq('username', admin_login.username).execute()
    
    if not response.data:
        # Log failed login attempt
        supabase.table('login_history').insert({
            "username": admin_login.username,
            "login_time": datetime.now(timezone.utc).isoformat(),
            "success": False
        }).execute()
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    user = response.data[0]
    
    if not verify_password(admin_login.password, user["hashed_password"]):
        # Log failed login attempt
        supabase.table('login_history').insert({
            "username": admin_login.username,
            "login_time": datetime.now(timezone.utc).isoformat(),
            "success": False
        }).execute()
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Update last login
    supabase.table('admin_users').update({
        "last_login": datetime.now(timezone.utc).isoformat()
    }).eq('username', admin_login.username).execute()
    
    # Log successful login
    supabase.table('login_history').insert({
        "username": admin_login.username,
        "login_time": datetime.now(timezone.utc).isoformat(),
        "success": True
    }).execute()
    
    # Create access token
    access_token = create_access_token(data={"sub": user["username"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@api_router.get("/auth/me", response_model=AdminUser)
async def get_current_user_info(current_user: AdminUser = Depends(get_current_user)):
    """Get current user information"""
    return current_user


# ============================================================================
# SERVICES MANAGEMENT ENDPOINTS
# ============================================================================

@api_router.get("/services", response_model=List[Service])
async def get_services():
    """Get all services with static data and gallery images"""
    import os
    import random
    
    # Define the 5 services with their corresponding photos (using consistent IDs)
    services_data = [
        {
            "id": "civil-construction-001",
            "title": "Civil Construction",
            "short_intro": "Reliable and high-quality civil construction services for residential and commercial projects with focus on durability, safety, and on-time delivery.",
            "overview": "At Synergy India, we specialize in delivering reliable and high-quality civil construction services for both residential and commercial projects. From laying strong foundations to completing full-scale structures, our focus is on durability, safety, and on-time delivery. Whether it's building a new home, a commercial complex, or boundary works, our team ensures that every project meets professional standards.",
            "sub_services": ["Foundation Work", "Structural Construction", "Boundary Works", "Commercial Buildings", "Residential Projects"],
            "benefits": ["Durable Construction", "Safety First", "On-time Delivery", "Professional Standards", "Quality Materials"],
            "cta_text": "Get Quote for Civil Construction",
            "images": ["/photos/civil construction.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "renovation-remodeling-002",
            "title": "Renovation & Remodeling",
            "short_intro": "Transform old spaces into modern, functional environments with enhanced aesthetics and improved functionality.",
            "overview": "At Synergy India, we transform old and outdated spaces into modern, functional, and stylish environments. Our renovation and remodeling services cover both residential and commercial properties, ensuring enhanced aesthetics, improved functionality, and long-lasting results. From simple upgrades to complete overhauls, we deliver designs that match your lifestyle and business needs.",
            "sub_services": ["Space Transformation", "Modern Design", "Functional Layouts", "Aesthetic Enhancement", "Complete Overhauls"],
            "benefits": ["Modern Design", "Enhanced Aesthetics", "Improved Functionality", "Long-lasting Results", "Lifestyle Matching"],
            "cta_text": "Transform Your Space Today",
            "images": ["/photos/remodeling.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "interior-design-003",
            "title": "Interior Design & Execution",
            "short_intro": "Creative interior design and execution services for modern homes, offices, and showrooms with visual appeal and space efficiency.",
            "overview": "At Synergy India, we bring creativity and functionality together through our interior design and execution services. Whether it's a modern home, a stylish office, or a premium showroom, our team delivers interiors that are visually appealing, space-efficient, and aligned with your personality or brand identity. We handle everything from design planning to complete execution.",
            "sub_services": ["Design Planning", "Space Efficiency", "Visual Appeal", "Brand Identity", "Complete Execution"],
            "benefits": ["Visual Appeal", "Space Efficiency", "Brand Alignment", "Complete Service", "Professional Design"],
            "cta_text": "Design Your Perfect Interior",
            "images": ["/photos/interior design.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "finishing-aesthetic-004",
            "title": "Finishing & Aesthetic Works",
            "short_intro": "Professional finishing and aesthetic services including painting, polishing, lighting, and wall treatments for polished results.",
            "overview": "The final touch is what makes every project stand out. At Synergy India, our finishing and aesthetic services ensure your space looks polished, elegant, and complete. From painting and polishing to decorative lighting and wall treatments, we focus on details that enhance the beauty and value of your property.",
            "sub_services": ["Painting & Polishing", "Decorative Lighting", "Wall Treatments", "Aesthetic Enhancement", "Property Value"],
            "benefits": ["Polished Finish", "Elegant Design", "Property Value", "Attention to Detail", "Complete Look"],
            "cta_text": "Perfect Your Space Finish",
            "images": ["/photos/finishing and astehic work.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "commercial-interiors-005",
            "title": "Commercial Interiors",
            "short_intro": "Commercial interior design and execution for offices, showrooms, and restaurants with smart space utilization and professional aesthetics.",
            "overview": "At Synergy India, we design and execute commercial interiors that combine functionality, aesthetics, and brand identity. From modern offices to stylish showrooms and cozy restaurants, our interiors are crafted to create the right impression and enhance productivity. We ensure smart space utilization, durable finishes, and a professional look tailored to your business.",
            "sub_services": ["Modern Offices", "Stylish Showrooms", "Restaurant Design", "Space Utilization", "Professional Look"],
            "benefits": ["Professional Impression", "Enhanced Productivity", "Smart Space Use", "Durable Finishes", "Business Tailored"],
            "cta_text": "Design Your Commercial Space",
            "images": ["/photos/commercial intereios.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "drip-irrigation-006",
            "title": "💧 Drip Irrigation System",
            "short_intro": "Modern water-efficient solution that supplies water directly to plant roots through controlled drop-by-drop method, saving 40-60% water.",
            "overview": "A modern water-efficient solution that supplies water directly to the root zone of each plant through a controlled drop-by-drop method. This system not only saves 40–60% of water but also allows uniform fertilizer distribution, reduces weed growth, and ensures healthier crops with higher productivity. Ideal for fruits, vegetables, and orchard farming.",
            "sub_services": ["Water Conservation", "Fertilizer Distribution", "Weed Control", "Crop Health", "Productivity Boost"],
            "benefits": ["40-60% Water Savings", "Uniform Water Distribution", "Reduced Weed Growth", "Healthier Crops", "Higher Productivity"],
            "cta_text": "Install Drip Irrigation System",
            "images": ["/photos/drip irrigation system .jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "sprinkler-irrigation-007",
            "title": "🌧 Sprinkler Irrigation System",
            "short_intro": "Advanced irrigation technique that sprays water under pressure to simulate natural rainfall with uniform coverage across the field.",
            "overview": "An advanced irrigation technique that sprays water under pressure to simulate natural rainfall. It provides uniform water coverage across the field, prevents soil erosion, and is suitable for almost all types of crops including cereals, pulses, and vegetables. This system helps reduce labor costs, saves time, and increases efficiency in both small and large-scale farms.",
            "sub_services": ["Rainfall Simulation", "Uniform Coverage", "Soil Erosion Prevention", "Multi-Crop Support", "Labor Cost Reduction"],
            "benefits": ["Natural Rainfall Simulation", "Uniform Water Coverage", "Soil Erosion Prevention", "Reduced Labor Costs", "Increased Efficiency"],
            "cta_text": "Setup Sprinkler System",
            "images": ["/photos/srinkler irrigation system.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "solar-plant-installation-008",
            "title": "☀ Solar Plant Installation with Government Support",
            "short_intro": "Complete solar power plant solutions with government subsidies and financial benefits for homes, businesses, and farmers.",
            "overview": "We provide complete solutions for setting up solar power plants under government-supported schemes. Our team handles everything from site survey, system design, and installation to documentation and approvals. With full guidance for availing subsidies and financial benefits, we make solar energy affordable and hassle-free for homes, businesses, and farmers. By choosing our service, you not only save on electricity bills but also contribute to a sustainable future.",
            "sub_services": ["Site Survey", "System Design", "Installation", "Documentation", "Subsidy Support"],
            "benefits": ["Government Subsidies", "Complete Solution", "Electricity Bill Savings", "Sustainable Future", "Hassle-Free Process"],
            "cta_text": "Get Solar Plant Quote",
            "images": ["/photos/solar plant installation.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    # Convert to Service objects
    services = []
    for service_data in services_data:
        services.append(Service(**service_data))

    return services

@api_router.get("/services/{service_id}", response_model=Service)
async def get_service_by_id(service_id: str):
    """Get a specific service by ID"""
    # Define the 5 services with their corresponding photos (using consistent IDs)
    services_data = [
        {
            "id": "civil-construction-001",
            "title": "Civil Construction",
            "short_intro": "Reliable and high-quality civil construction services for residential and commercial projects with focus on durability, safety, and on-time delivery.",
            "overview": "At Synergy India, we specialize in delivering reliable and high-quality civil construction services for both residential and commercial projects. From laying strong foundations to completing full-scale structures, our focus is on durability, safety, and on-time delivery. Whether it's building a new home, a commercial complex, or boundary works, our team ensures that every project meets professional standards.",
            "sub_services": ["Foundation Work", "Structural Construction", "Boundary Works", "Commercial Buildings", "Residential Projects"],
            "benefits": ["Durable Construction", "Safety First", "On-time Delivery", "Professional Standards", "Quality Materials"],
            "cta_text": "Get Quote for Civil Construction",
            "images": ["/photos/civil construction.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "renovation-remodeling-002",
            "title": "Renovation & Remodeling",
            "short_intro": "Transform old spaces into modern, functional environments with enhanced aesthetics and improved functionality.",
            "overview": "At Synergy India, we transform old and outdated spaces into modern, functional, and stylish environments. Our renovation and remodeling services cover both residential and commercial properties, ensuring enhanced aesthetics, improved functionality, and long-lasting results. From simple upgrades to complete overhauls, we deliver designs that match your lifestyle and business needs.",
            "sub_services": ["Space Transformation", "Modern Design", "Functional Layouts", "Aesthetic Enhancement", "Complete Overhauls"],
            "benefits": ["Modern Design", "Enhanced Aesthetics", "Improved Functionality", "Long-lasting Results", "Lifestyle Matching"],
            "cta_text": "Transform Your Space Today",
            "images": ["/photos/remodeling.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "interior-design-003",
            "title": "Interior Design & Execution",
            "short_intro": "Creative interior design and execution services for modern homes, offices, and showrooms with visual appeal and space efficiency.",
            "overview": "At Synergy India, we bring creativity and functionality together through our interior design and execution services. Whether it's a modern home, a stylish office, or a premium showroom, our team delivers interiors that are visually appealing, space-efficient, and aligned with your personality or brand identity. We handle everything from design planning to complete execution.",
            "sub_services": ["Design Planning", "Space Efficiency", "Visual Appeal", "Brand Identity", "Complete Execution"],
            "benefits": ["Visual Appeal", "Space Efficiency", "Brand Alignment", "Complete Service", "Professional Design"],
            "cta_text": "Design Your Perfect Interior",
            "images": ["/photos/interior design.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "finishing-aesthetic-004",
            "title": "Finishing & Aesthetic Works",
            "short_intro": "Professional finishing and aesthetic services including painting, polishing, lighting, and wall treatments for polished results.",
            "overview": "The final touch is what makes every project stand out. At Synergy India, our finishing and aesthetic services ensure your space looks polished, elegant, and complete. From painting and polishing to decorative lighting and wall treatments, we focus on details that enhance the beauty and value of your property.",
            "sub_services": ["Painting & Polishing", "Decorative Lighting", "Wall Treatments", "Aesthetic Enhancement", "Property Value"],
            "benefits": ["Polished Finish", "Elegant Design", "Property Value", "Attention to Detail", "Complete Look"],
            "cta_text": "Perfect Your Space Finish",
            "images": ["/photos/finishing and astehic work.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "commercial-interiors-005",
            "title": "Commercial Interiors",
            "short_intro": "Commercial interior design and execution for offices, showrooms, and restaurants with smart space utilization and professional aesthetics.",
            "overview": "At Synergy India, we design and execute commercial interiors that combine functionality, aesthetics, and brand identity. From modern offices to stylish showrooms and cozy restaurants, our interiors are crafted to create the right impression and enhance productivity. We ensure smart space utilization, durable finishes, and a professional look tailored to your business.",
            "sub_services": ["Modern Offices", "Stylish Showrooms", "Restaurant Design", "Space Utilization", "Professional Look"],
            "benefits": ["Professional Impression", "Enhanced Productivity", "Smart Space Use", "Durable Finishes", "Business Tailored"],
            "cta_text": "Design Your Commercial Space",
            "images": ["/photos/commercial intereios.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "drip-irrigation-006",
            "title": "💧 Drip Irrigation System",
            "short_intro": "Modern water-efficient solution that supplies water directly to plant roots through controlled drop-by-drop method, saving 40-60% water.",
            "overview": "A modern water-efficient solution that supplies water directly to the root zone of each plant through a controlled drop-by-drop method. This system not only saves 40–60% of water but also allows uniform fertilizer distribution, reduces weed growth, and ensures healthier crops with higher productivity. Ideal for fruits, vegetables, and orchard farming.",
            "sub_services": ["Water Conservation", "Fertilizer Distribution", "Weed Control", "Crop Health", "Productivity Boost"],
            "benefits": ["40-60% Water Savings", "Uniform Water Distribution", "Reduced Weed Growth", "Healthier Crops", "Higher Productivity"],
            "cta_text": "Install Drip Irrigation System",
            "images": ["/photos/drip irrigation system .jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "sprinkler-irrigation-007",
            "title": "🌧 Sprinkler Irrigation System",
            "short_intro": "Advanced irrigation technique that sprays water under pressure to simulate natural rainfall with uniform coverage across the field.",
            "overview": "An advanced irrigation technique that sprays water under pressure to simulate natural rainfall. It provides uniform water coverage across the field, prevents soil erosion, and is suitable for almost all types of crops including cereals, pulses, and vegetables. This system helps reduce labor costs, saves time, and increases efficiency in both small and large-scale farms.",
            "sub_services": ["Rainfall Simulation", "Uniform Coverage", "Soil Erosion Prevention", "Multi-Crop Support", "Labor Cost Reduction"],
            "benefits": ["Natural Rainfall Simulation", "Uniform Water Coverage", "Soil Erosion Prevention", "Reduced Labor Costs", "Increased Efficiency"],
            "cta_text": "Setup Sprinkler System",
            "images": ["/photos/srinkler irrigation system.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "solar-plant-installation-008",
            "title": "☀ Solar Plant Installation with Government Support",
            "short_intro": "Complete solar power plant solutions with government subsidies and financial benefits for homes, businesses, and farmers.",
            "overview": "We provide complete solutions for setting up solar power plants under government-supported schemes. Our team handles everything from site survey, system design, and installation to documentation and approvals. With full guidance for availing subsidies and financial benefits, we make solar energy affordable and hassle-free for homes, businesses, and farmers. By choosing our service, you not only save on electricity bills but also contribute to a sustainable future.",
            "sub_services": ["Site Survey", "System Design", "Installation", "Documentation", "Subsidy Support"],
            "benefits": ["Government Subsidies", "Complete Solution", "Electricity Bill Savings", "Sustainable Future", "Hassle-Free Process"],
            "cta_text": "Get Solar Plant Quote",
            "images": ["/photos/solar plant installation.jpg"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    # Find the service by ID
    for service_data in services_data:
        if service_data["id"] == service_id:
            return Service(**service_data)
    
    # If service not found, raise 404 - IMPORTANT: Keep this at function level, not inside the loop!
    raise HTTPException(status_code=404, detail="Service not found")


@api_router.post("/services", response_model=Service)
async def create_service(
    service_data: ServiceCreate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Create new service"""
    service_dict = service_data.dict()
    service_dict['id'] = str(uuid.uuid4())
    service_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    service_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    response = supabase.table('services').insert(service_dict).execute()
    return Service(**response.data[0])

@api_router.put("/services/{service_id}", response_model=Service)
async def update_service(
    service_id: str,
    service_update: ServiceUpdate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update service"""
    response = supabase.table('services').select('*').eq('id', service_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Service not found")
    
    update_data = {k: v for k, v in service_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    supabase.table('services').update(update_data).eq('id', service_id).execute()
    
    updated_response = supabase.table('services').select('*').eq('id', service_id).execute()
    return Service(**updated_response.data[0])

@api_router.delete("/services/{service_id}")
async def delete_service(
    service_id: str,
    current_user: AdminUser = Depends(get_current_user)
):
    """Delete service"""
    response = supabase.table('services').delete().eq('id', service_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted successfully"}

@api_router.post("/services/{service_id}/images")
async def upload_service_image(
    service_id: str,
    file: UploadFile = File(...),
    current_user: AdminUser = Depends(get_current_user)
):
    """Upload image for service"""
    response = supabase.table('services').select('*').eq('id', service_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Service not found")
    
    service = response.data[0]
    
    # Check if service already has 4 images
    if len(service.get("images", [])) >= 4:
        raise HTTPException(status_code=400, detail="Service can have maximum 4 images")
    
    # Upload to Supabase storage
    image_url = await upload_to_supabase_storage(file, "services")
    
    # Add image URL to service
    current_images = service.get("images", [])
    current_images.append(image_url)
    
    supabase.table('services').update({
        "images": current_images,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq('id', service_id).execute()
    
    return {"message": "Image uploaded successfully", "image_url": image_url}

@api_router.delete("/services/{service_id}/images")
async def remove_service_image(
    service_id: str,
    image_url: str = Form(...),
    current_user: AdminUser = Depends(get_current_user)
):
    """Remove image from service"""
    response = supabase.table('services').select('*').eq('id', service_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Service not found")
    
    service = response.data[0]
    current_images = service.get("images", [])
    
    if image_url in current_images:
        current_images.remove(image_url)
        
        supabase.table('services').update({
            "images": current_images,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).eq('id', service_id).execute()
    
    return {"message": "Image removed successfully"}


# ============================================================================
# GALLERY MANAGEMENT ENDPOINTS (Static Images)
# ============================================================================

@api_router.get("/gallery", response_model=List[GalleryImage])
async def get_gallery_images():
    """Get all gallery images from photos directory"""
    import os
    import random
    
    # Use the same photos directory as services
    photos_dir = Path("../photos")
    if not photos_dir.exists():
        return []
    
    # Get all image files from the photos directory
    image_files = []
    for file_path in photos_dir.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
            image_files.append(file_path)
    
    # Create gallery images with service-specific titles and categories
    gallery_images = []
    
    # Map filenames to proper titles and categories
    photo_mapping = {
        "civil construction.jpg": {
            "title": "Civil Construction Work",
            "category": "Civil Work",
            "caption": "Professional civil construction services including foundation work and structural building"
        },
        "remodeling.jpg": {
            "title": "Renovation & Remodeling",
            "category": "Renovation",
            "caption": "Complete space transformation and remodeling services"
        },
        "interior design.jpg": {
            "title": "Interior Design & Execution",
            "category": "Interior Design",
            "caption": "Creative interior design and execution for modern spaces"
        },
        "finishing and astehic work.jpg": {
            "title": "Finishing & Aesthetic Works",
            "category": "Finishing",
            "caption": "Professional finishing and aesthetic services"
        },
        "commercial intereios.jpg": {
            "title": "Commercial Interiors",
            "category": "Commercial",
            "caption": "Commercial interior design for offices and showrooms"
        },
        "drip irrigation system .jpg": {
            "title": "💧 Drip Irrigation System",
            "category": "Agriculture",
            "caption": "Modern water-efficient irrigation system saving 40-60% water"
        },
        "srinkler irrigation system.jpg": {
            "title": "🌧 Sprinkler Irrigation System",
            "category": "Agriculture",
            "caption": "Advanced irrigation technique simulating natural rainfall"
        },
        "solar plant installation.jpg": {
            "title": "☀ Solar Plant Installation",
            "category": "Solar Energy",
            "caption": "Complete solar power plant solutions with government support"
        }
    }
    
    for i, file_path in enumerate(image_files):
        filename = file_path.name
        photo_info = photo_mapping.get(filename, {
            "title": "SYNERGY INDIA Project",
            "category": "Construction",
            "caption": "High-quality construction and design work by SYNERGY INDIA"
        })
        
        gallery_image = GalleryImage(
            id=str(uuid.uuid4()),
            url=f"/photos/{filename}",
            alt_text=photo_info["title"],
            caption=photo_info["caption"],
            category=photo_info["category"],
            order=i,
            is_active=True,
            created_at=datetime.now(timezone.utc).isoformat(),
            updated_at=datetime.now(timezone.utc).isoformat()
        )
        gallery_images.append(gallery_image)
    
    return gallery_images


# ============================================================================
# LEADS MANAGEMENT ENDPOINTS
# ============================================================================

@api_router.get("/leads", response_model=List[Lead])
async def get_leads(
    status: Optional[str] = None,
    current_user: AdminUser = Depends(get_current_user)
):
    """Get all leads with optional status filter"""
    query = supabase.table('leads').select('*')
    
    if status:
        query = query.eq('status', status)
    
    response = query.order('created_at', desc=True).execute()
    return [Lead(**lead) for lead in response.data]

@api_router.get("/leads/{lead_id}", response_model=Lead)
async def get_lead(
    lead_id: str,
    current_user: AdminUser = Depends(get_current_user)
):
    """Get lead by ID"""
    response = supabase.table('leads').select('*').eq('id', lead_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Lead not found")
    return Lead(**response.data[0])

@api_router.post("/leads", response_model=Lead)
async def create_lead(lead_data: LeadCreate):
    """Create new lead (public endpoint for contact form)"""
    lead_dict = lead_data.dict()
    lead_dict['id'] = str(uuid.uuid4())
    lead_dict['status'] = 'New'
    lead_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    lead_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    response = supabase.table('leads').insert(lead_dict).execute()
    return Lead(**response.data[0])

@api_router.put("/leads/{lead_id}", response_model=Lead)
async def update_lead(
    lead_id: str,
    lead_update: LeadUpdate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update lead status"""
    response = supabase.table('leads').select('*').eq('id', lead_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    update_data = {k: v for k, v in lead_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    supabase.table('leads').update(update_data).eq('id', lead_id).execute()
    
    updated_response = supabase.table('leads').select('*').eq('id', lead_id).execute()
    return Lead(**updated_response.data[0])

@api_router.delete("/leads/{lead_id}")
async def delete_lead(
    lead_id: str,
    current_user: AdminUser = Depends(get_current_user)
):
    """Delete lead"""
    response = supabase.table('leads').delete().eq('id', lead_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted successfully"}

@api_router.get("/leads/export/csv")
async def export_leads_csv(current_user: AdminUser = Depends(get_current_user)):
    """Export all leads to CSV"""
    response = supabase.table('leads').select('*').order('created_at', desc=True).execute()
    leads = response.data
    
    # Create CSV content
    csv_content = "Name,Phone,Email,Service Interested,Project Type,Message,Status,Created At\n"
    for lead in leads:
        csv_content += f'"{lead.get("name", "")}","{lead.get("phone", "")}","{lead.get("email", "")}","{lead.get("service_interested", "")}","{lead.get("project_type", "")}","{lead.get("message", "")}","{lead.get("status", "")}","{lead.get("created_at", "")}"\n'
    
    return {
        "filename": f"leads_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        "content": csv_content
    }


# ============================================================================
# SETTINGS MANAGEMENT ENDPOINTS
# ============================================================================

@api_router.get("/settings/contact-form", response_model=ContactFormSettings)
async def get_contact_form_settings():
    """Get contact form settings"""
    response = supabase.table('contact_form_settings').select('*').limit(1).execute()
    if not response.data:
        # Return default settings
        default_settings = ContactFormSettings(
            service_options=["Civil & Interior Work", "Agriculture Solutions", "Solar Equipment"],
            project_type_options=["Residential", "Commercial", "Agricultural", "Industrial"],
            admin_email="info@synergyindia.com",
            whatsapp_number="918404861022"
        )
        return default_settings
    return ContactFormSettings(**response.data[0])

@api_router.put("/settings/contact-form", response_model=ContactFormSettings)
async def update_contact_form_settings(
    settings_update: ContactFormSettingsUpdate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update contact form settings"""
    response = supabase.table('contact_form_settings').select('*').limit(1).execute()
    
    if not response.data:
        # Create new settings
        new_settings_data = settings_update.dict(exclude_unset=True)
        new_settings_data['id'] = str(uuid.uuid4())
        new_settings_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        response = supabase.table('contact_form_settings').insert(new_settings_data).execute()
        return ContactFormSettings(**response.data[0])
    
    update_data = {k: v for k, v in settings_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    supabase.table('contact_form_settings').update(update_data).eq('id', response.data[0]['id']).execute()
    
    updated_response = supabase.table('contact_form_settings').select('*').limit(1).execute()
    return ContactFormSettings(**updated_response.data[0])

@api_router.get("/settings/cta", response_model=CTASettings)
async def get_cta_settings():
    """Get CTA settings"""
    response = supabase.table('cta_settings').select('*').limit(1).execute()
    if not response.data:
        # Return default settings
        default_settings = CTASettings(
            whatsapp_template="Hello! I would like to know about {service_name} services.",
            call_number="+916123597570",
            contact_page_link="/contact"
        )
        return default_settings
    return CTASettings(**response.data[0])

@api_router.put("/settings/cta", response_model=CTASettings)
async def update_cta_settings(
    settings_update: CTASettingsUpdate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update CTA settings"""
    response = supabase.table('cta_settings').select('*').limit(1).execute()
    
    if not response.data:
        # Create new settings
        new_settings_data = settings_update.dict(exclude_unset=True)
        new_settings_data['id'] = str(uuid.uuid4())
        new_settings_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        response = supabase.table('cta_settings').insert(new_settings_data).execute()
        return CTASettings(**response.data[0])
    
    update_data = {k: v for k, v in settings_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    supabase.table('cta_settings').update(update_data).eq('id', response.data[0]['id']).execute()
    
    updated_response = supabase.table('cta_settings').select('*').limit(1).execute()
    return CTASettings(**updated_response.data[0])

@api_router.get("/settings/general", response_model=GeneralSettings)
async def get_general_settings():
    """Get general settings"""
    response = supabase.table('general_settings').select('*').limit(1).execute()
    if not response.data:
        # Return default settings
        default_settings = GeneralSettings(
            site_name="SYNERGY INDIA",
            logo_url="https://customer-assets.emergentagent.com/job_4e865656-4cd3-4df9-b985-379e174ef909/artifacts/e98t14ka_WhatsApp%20Image%202025-09-16%20at%2018.19.38_99f24a69.jpg",
            office_address="05, Chaudhary Market, Opposite Paras HMRI Hospital, Raja Bazar, Patna - 800014",
            phone="+91-8404861022",
            email="info@synergyindia.com",
            office_hours="Mon-Sat: 9 AM - 6 PM",
            social_media={
                "facebook": "",
                "instagram": "",
                "twitter": "",
                "linkedin": ""
            }
        )
        return default_settings
    return GeneralSettings(**response.data[0])

@api_router.put("/settings/general", response_model=GeneralSettings)
async def update_general_settings(
    settings_update: GeneralSettingsUpdate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update general settings"""
    response = supabase.table('general_settings').select('*').limit(1).execute()
    
    if not response.data:
        # Create new settings
        new_settings_data = settings_update.dict(exclude_unset=True)
        new_settings_data['id'] = str(uuid.uuid4())
        new_settings_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        response = supabase.table('general_settings').insert(new_settings_data).execute()
        return GeneralSettings(**response.data[0])
    
    update_data = {k: v for k, v in settings_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    supabase.table('general_settings').update(update_data).eq('id', response.data[0]['id']).execute()
    
    updated_response = supabase.table('general_settings').select('*').limit(1).execute()
    return GeneralSettings(**updated_response.data[0])

@api_router.post("/settings/general/logo")
async def upload_logo(
    file: UploadFile = File(...),
    current_user: AdminUser = Depends(get_current_user)
):
    """Upload new logo"""
    # Upload to Supabase storage
    logo_url = await upload_to_supabase_storage(file, "logos")
    
    # Update general settings
    response = supabase.table('general_settings').select('*').limit(1).execute()
    
    if response.data:
        supabase.table('general_settings').update({
            "logo_url": logo_url,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).eq('id', response.data[0]['id']).execute()
    else:
        # Create new general settings
        supabase.table('general_settings').insert({
            "id": str(uuid.uuid4()),
            "site_name": "SYNERGY INDIA",
            "logo_url": logo_url,
            "office_address": "",
            "phone": "",
            "email": "",
            "office_hours": "",
            "social_media": {},
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).execute()
    
    return {"message": "Logo uploaded successfully", "logo_url": logo_url}


# ============================================================================
# DASHBOARD ENDPOINTS
# ============================================================================

@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: AdminUser = Depends(get_current_user)):
    """Get dashboard statistics"""
    # Get stats
    leads_response = supabase.table('leads').select('id', count='exact').execute()
    total_leads = leads_response.count or 0
    
    # Get today's enquiries
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
    today_response = supabase.table('leads').select('id', count='exact').gte('created_at', today_start).execute()
    today_enquiries = today_response.count or 0
    
    # Count static services (always 5)
    total_services = 5
    
    # Count static gallery images
    gallery_dir = Path("uploads/gallery")
    total_gallery_images = 0
    if gallery_dir.exists():
        total_gallery_images = len([f for f in gallery_dir.iterdir() 
                                  if f.is_file() and f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']])
    
    # Get recent leads (last 5)
    recent_response = supabase.table('leads').select('*').order('created_at', desc=True).limit(5).execute()
    recent_leads = [Lead(**lead) for lead in recent_response.data]
    
    return DashboardStats(
        total_leads=total_leads,
        today_enquiries=today_enquiries,
        total_services=total_services,
        total_gallery_images=total_gallery_images,
        recent_leads=recent_leads
    )


# ============================================================================
# SECURITY & BACKUP ENDPOINTS
# ============================================================================

@api_router.get("/security/login-history", response_model=List[LoginHistory])
async def get_login_history(current_user: AdminUser = Depends(get_current_user)):
    """Get login history"""
    response = supabase.table('login_history').select('*').order('login_time', desc=True).limit(100).execute()
    return [LoginHistory(**record) for record in response.data]

@api_router.post("/backup/manual")
async def manual_backup(current_user: AdminUser = Depends(get_current_user)):
    """Manual backup (placeholder - implement based on requirements)"""
    # This is a placeholder - actual implementation would depend on backup requirements
    backup_id = str(uuid.uuid4())
    timestamp = datetime.now(timezone.utc)
    
    return {
        "message": "Manual backup initiated",
        "backup_id": backup_id,
        "timestamp": timestamp,
        "status": "initiated"
    }


# ============================================================================
# LEGACY ENDPOINTS (for backward compatibility)
# ============================================================================

@api_router.get("/")
async def root():
    return {"message": "SYNERGY INDIA Admin API", "version": "1.0.0"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_data = input.dict()
    status_data['id'] = str(uuid.uuid4())
    status_data['timestamp'] = datetime.now(timezone.utc).isoformat()
    
    response = supabase.table('status_checks').insert(status_data).execute()
    return StatusCheck(**response.data[0])

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    response = supabase.table('status_checks').select('*').execute()
    return [StatusCheck(**status_check) for status_check in response.data]


# Include the router in the main app
app.include_router(api_router)

# Add static file serving for photos
from fastapi.staticfiles import StaticFiles
app.mount("/photos", StaticFiles(directory="../photos"), name="photos")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
