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
    """Get all services"""
    response = supabase.table('services').select('*').order('created_at', desc=True).execute()
    return [Service(**service) for service in response.data]

@api_router.get("/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    """Get service by ID"""
    response = supabase.table('services').select('*').eq('id', service_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Service not found")
    return Service(**response.data[0])

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
# GALLERY MANAGEMENT ENDPOINTS
# ============================================================================

@api_router.get("/gallery", response_model=List[GalleryImage])
async def get_gallery_images():
    """Get all gallery images"""
    response = supabase.table('gallery').select('*').order('order').execute()
    return [GalleryImage(**image) for image in response.data]

@api_router.get("/gallery/{image_id}", response_model=GalleryImage)
async def get_gallery_image(image_id: str):
    """Get gallery image by ID"""
    response = supabase.table('gallery').select('*').eq('id', image_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Image not found")
    return GalleryImage(**response.data[0])

@api_router.post("/gallery", response_model=GalleryImage)
async def upload_gallery_image(
    file: UploadFile = File(...),
    alt_text: str = Form(...),
    caption: str = Form(...),
    category: str = Form(...),
    order: int = Form(0),
    is_active: bool = Form(True),
    current_user: AdminUser = Depends(get_current_user)
):
    """Upload new gallery image"""
    # Upload to Supabase storage
    image_url = await upload_to_supabase_storage(file, "gallery")
    
    # Create gallery image record
    gallery_image_data = {
        "id": str(uuid.uuid4()),
        "url": image_url,
        "alt_text": alt_text,
        "caption": caption,
        "category": category,
        "order": order,
        "is_active": is_active,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    response = supabase.table('gallery').insert(gallery_image_data).execute()
    return GalleryImage(**response.data[0])

@api_router.put("/gallery/{image_id}", response_model=GalleryImage)
async def update_gallery_image(
    image_id: str,
    image_update: GalleryImageUpdate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update gallery image"""
    response = supabase.table('gallery').select('*').eq('id', image_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Image not found")
    
    update_data = {k: v for k, v in image_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    supabase.table('gallery').update(update_data).eq('id', image_id).execute()
    
    updated_response = supabase.table('gallery').select('*').eq('id', image_id).execute()
    return GalleryImage(**updated_response.data[0])

@api_router.delete("/gallery/{image_id}")
async def delete_gallery_image(
    image_id: str,
    current_user: AdminUser = Depends(get_current_user)
):
    """Delete gallery image"""
    response = supabase.table('gallery').select('*').eq('id', image_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Image not found")
    
    image = response.data[0]
    
    # Delete from database
    supabase.table('gallery').delete().eq('id', image_id).execute()
    
    return {"message": "Image deleted successfully"}

@api_router.put("/gallery/reorder")
async def reorder_gallery_images(
    image_orders: List[Dict[str, int]],
    current_user: AdminUser = Depends(get_current_user)
):
    """Reorder gallery images"""
    for item in image_orders:
        supabase.table('gallery').update({
            "order": item["order"],
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).eq('id', item["id"]).execute()
    
    return {"message": "Images reordered successfully"}


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
    
    services_response = supabase.table('services').select('id', count='exact').eq('is_active', True).execute()
    total_services = services_response.count or 0
    
    gallery_response = supabase.table('gallery').select('id', count='exact').eq('is_active', True).execute()
    total_gallery_images = gallery_response.count or 0
    
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
