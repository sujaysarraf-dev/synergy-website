from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
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


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'synergy-india-secret-key')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Security
security = HTTPBearer()

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Create the main app without a prefix
app = FastAPI(title="SYNERGY INDIA Admin API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Mount static files for uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


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
    short_intro: Optional[str] = None  # New field for service cards
    overview: str
    sub_services: List[str]
    benefits: List[str]
    cta_text: str
    images: List[str] = []  # Image URLs
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
    category: str  # Civil, Renovation, Interior, Finishing, Commercial, etc.
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
    status: str = "New"  # New, In Progress, Closed
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
    social_media: Dict[str, str]  # {"facebook": "url", "instagram": "url", etc.}
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

# Old models for backward compatibility
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
        
        # Check if user exists in database
        user = await db.admin_users.find_one({"username": username})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return AdminUser(**user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

async def save_uploaded_file(file: UploadFile, directory: str = "general") -> str:
    """Save uploaded file and return URL"""
    if file.size > 1024 * 1024:  # 1MB limit
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 1MB")
    
    # Create directory if it doesn't exist
    upload_path = UPLOAD_DIR / directory
    upload_path.mkdir(exist_ok=True)
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = upload_path / filename
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    # Optimize image if it's an image file
    if file.content_type and file.content_type.startswith('image/'):
        try:
            with Image.open(file_path) as img:
                # Resize if too large (max 1920x1080)
                if img.width > 1920 or img.height > 1080:
                    img.thumbnail((1920, 1080), Image.Resampling.LANCZOS)
                    img.save(file_path, optimize=True, quality=85)
        except Exception as e:
            logger.warning(f"Could not optimize image: {e}")
    
    return f"/uploads/{directory}/{filename}"

# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(admin_login: AdminLogin):
    """Admin login endpoint"""
    # Check if user exists
    user = await db.admin_users.find_one({"username": admin_login.username})
    
    if not user or not verify_password(admin_login.password, user["hashed_password"]):
        # Log failed login attempt
        await db.login_history.insert_one({
            "id": str(uuid.uuid4()),
            "username": admin_login.username,
            "login_time": datetime.now(timezone.utc),
            "success": False
        })
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Update last login
    await db.admin_users.update_one(
        {"username": admin_login.username},
        {"$set": {"last_login": datetime.now(timezone.utc)}}
    )
    
    # Log successful login
    await db.login_history.insert_one({
        "id": str(uuid.uuid4()),
        "username": admin_login.username,
        "login_time": datetime.now(timezone.utc),
        "success": True
    })
    
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
    services = await db.services.find().to_list(1000)
    return [Service(**service) for service in services]

@api_router.get("/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    """Get service by ID"""
    service = await db.services.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return Service(**service)

@api_router.post("/services", response_model=Service)
async def create_service(
    service_data: ServiceCreate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Create new service"""
    service = Service(**service_data.dict())
    await db.services.insert_one(service.dict())
    return service

@api_router.put("/services/{service_id}", response_model=Service)
async def update_service(
    service_id: str,
    service_update: ServiceUpdate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update service"""
    service = await db.services.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    update_data = {k: v for k, v in service_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    await db.services.update_one({"id": service_id}, {"$set": update_data})
    
    updated_service = await db.services.find_one({"id": service_id})
    return Service(**updated_service)

@api_router.delete("/services/{service_id}")
async def delete_service(
    service_id: str,
    current_user: AdminUser = Depends(get_current_user)
):
    """Delete service"""
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted successfully"}

@api_router.post("/services/{service_id}/images")
async def upload_service_image(
    service_id: str,
    file: UploadFile = File(...),
    current_user: AdminUser = Depends(get_current_user)
):
    """Upload image for service"""
    service = await db.services.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Check if service already has 4 images
    if len(service.get("images", [])) >= 4:
        raise HTTPException(status_code=400, detail="Service can have maximum 4 images")
    
    # Save uploaded file
    image_url = await save_uploaded_file(file, "services")
    
    # Add image URL to service
    await db.services.update_one(
        {"id": service_id},
        {"$push": {"images": image_url}, "$set": {"updated_at": datetime.now(timezone.utc)}}
    )
    
    return {"message": "Image uploaded successfully", "image_url": image_url}

@api_router.delete("/services/{service_id}/images")
async def remove_service_image(
    service_id: str,
    image_url: str = Form(...),
    current_user: AdminUser = Depends(get_current_user)
):
    """Remove image from service"""
    service = await db.services.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Remove image URL from service
    await db.services.update_one(
        {"id": service_id},
        {"$pull": {"images": image_url}, "$set": {"updated_at": datetime.now(timezone.utc)}}
    )
    
    # Try to delete physical file
    try:
        file_path = Path("." + image_url)  # Remove leading slash
        if file_path.exists():
            file_path.unlink()
    except Exception as e:
        logger.warning(f"Could not delete file {image_url}: {e}")
    
    return {"message": "Image removed successfully"}
# ============================================================================
# GALLERY MANAGEMENT ENDPOINTS
# ============================================================================

@api_router.get("/gallery", response_model=List[GalleryImage])
async def get_gallery_images():
    """Get all gallery images"""
    images = await db.gallery.find().sort("order", 1).to_list(1000)
    return [GalleryImage(**image) for image in images]

@api_router.get("/gallery/{image_id}", response_model=GalleryImage)
async def get_gallery_image(image_id: str):
    """Get gallery image by ID"""
    image = await db.gallery.find_one({"id": image_id})
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return GalleryImage(**image)

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
    # Save uploaded file
    image_url = await save_uploaded_file(file, "gallery")
    
    # Create gallery image record
    gallery_image = GalleryImage(
        url=image_url,
        alt_text=alt_text,
        caption=caption,
        category=category,
        order=order,
        is_active=is_active
    )
    
    await db.gallery.insert_one(gallery_image.dict())
    return gallery_image

@api_router.put("/gallery/{image_id}", response_model=GalleryImage)
async def update_gallery_image(
    image_id: str,
    image_update: GalleryImageUpdate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update gallery image"""
    image = await db.gallery.find_one({"id": image_id})
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    update_data = {k: v for k, v in image_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    await db.gallery.update_one({"id": image_id}, {"$set": update_data})
    
    updated_image = await db.gallery.find_one({"id": image_id})
    return GalleryImage(**updated_image)

@api_router.delete("/gallery/{image_id}")
async def delete_gallery_image(
    image_id: str,
    current_user: AdminUser = Depends(get_current_user)
):
    """Delete gallery image"""
    image = await db.gallery.find_one({"id": image_id})
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Delete from database
    await db.gallery.delete_one({"id": image_id})
    
    # Try to delete physical file
    try:
        file_path = Path("." + image["url"])  # Remove leading slash
        if file_path.exists():
            file_path.unlink()
    except Exception as e:
        logger.warning(f"Could not delete file {image['url']}: {e}")
    
    return {"message": "Image deleted successfully"}

@api_router.put("/gallery/reorder")
async def reorder_gallery_images(
    image_orders: List[Dict[str, int]],  # [{"id": "123", "order": 1}, ...]
    current_user: AdminUser = Depends(get_current_user)
):
    """Reorder gallery images"""
    for item in image_orders:
        await db.gallery.update_one(
            {"id": item["id"]},
            {"$set": {"order": item["order"], "updated_at": datetime.now(timezone.utc)}}
        )
    
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
    query = {}
    if status:
        query["status"] = status
    
    leads = await db.leads.find(query).sort("created_at", -1).to_list(1000)
    return [Lead(**lead) for lead in leads]

@api_router.get("/leads/{lead_id}", response_model=Lead)
async def get_lead(
    lead_id: str,
    current_user: AdminUser = Depends(get_current_user)
):
    """Get lead by ID"""
    lead = await db.leads.find_one({"id": lead_id})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return Lead(**lead)

@api_router.post("/leads", response_model=Lead)
async def create_lead(lead_data: LeadCreate):
    """Create new lead (public endpoint for contact form)"""
    lead = Lead(**lead_data.dict())
    await db.leads.insert_one(lead.dict())
    return lead

@api_router.put("/leads/{lead_id}", response_model=Lead)
async def update_lead(
    lead_id: str,
    lead_update: LeadUpdate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update lead status"""
    lead = await db.leads.find_one({"id": lead_id})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    update_data = {k: v for k, v in lead_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    await db.leads.update_one({"id": lead_id}, {"$set": update_data})
    
    updated_lead = await db.leads.find_one({"id": lead_id})
    return Lead(**updated_lead)

@api_router.delete("/leads/{lead_id}")
async def delete_lead(
    lead_id: str,
    current_user: AdminUser = Depends(get_current_user)
):
    """Delete lead"""
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted successfully"}

@api_router.get("/leads/export/csv")
async def export_leads_csv(current_user: AdminUser = Depends(get_current_user)):
    """Export all leads to CSV"""
    leads = await db.leads.find().sort("created_at", -1).to_list(10000)
    
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
    settings = await db.contact_form_settings.find_one()
    if not settings:
        # Return default settings
        default_settings = ContactFormSettings(
            service_options=["Civil & Interior Work", "Agriculture Solutions", "Solar Equipment"],
            project_type_options=["Residential", "Commercial", "Agricultural", "Industrial"],
            admin_email="info@synergyindia.com",
            whatsapp_number="918404861022"
        )
        await db.contact_form_settings.insert_one(default_settings.dict())
        return default_settings
    return ContactFormSettings(**settings)

@api_router.put("/settings/contact-form", response_model=ContactFormSettings)
async def update_contact_form_settings(
    settings_update: ContactFormSettingsUpdate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update contact form settings"""
    settings = await db.contact_form_settings.find_one()
    
    if not settings:
        # Create new settings
        new_settings = ContactFormSettings(**settings_update.dict(exclude_unset=True))
        await db.contact_form_settings.insert_one(new_settings.dict())
        return new_settings
    
    update_data = {k: v for k, v in settings_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    await db.contact_form_settings.update_one({}, {"$set": update_data})
    
    updated_settings = await db.contact_form_settings.find_one()
    return ContactFormSettings(**updated_settings)

@api_router.get("/settings/cta", response_model=CTASettings)
async def get_cta_settings():
    """Get CTA settings"""
    settings = await db.cta_settings.find_one()
    if not settings:
        # Return default settings
        default_settings = CTASettings(
            whatsapp_template="Hello! I would like to know about {service_name} services.",
            call_number="+916123597570",
            contact_page_link="/contact"
        )
        await db.cta_settings.insert_one(default_settings.dict())
        return default_settings
    return CTASettings(**settings)

@api_router.put("/settings/cta", response_model=CTASettings)
async def update_cta_settings(
    settings_update: CTASettingsUpdate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update CTA settings"""
    settings = await db.cta_settings.find_one()
    
    if not settings:
        # Create new settings
        new_settings = CTASettings(**settings_update.dict(exclude_unset=True))
        await db.cta_settings.insert_one(new_settings.dict())
        return new_settings
    
    update_data = {k: v for k, v in settings_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    await db.cta_settings.update_one({}, {"$set": update_data})
    
    updated_settings = await db.cta_settings.find_one()
    return CTASettings(**updated_settings)

@api_router.get("/settings/general", response_model=GeneralSettings)
async def get_general_settings():
    """Get general settings"""
    settings = await db.general_settings.find_one()
    if not settings:
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
        await db.general_settings.insert_one(default_settings.dict())
        return default_settings
    return GeneralSettings(**settings)

@api_router.put("/settings/general", response_model=GeneralSettings)
async def update_general_settings(
    settings_update: GeneralSettingsUpdate,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update general settings"""
    settings = await db.general_settings.find_one()
    
    if not settings:
        # Create new settings
        new_settings = GeneralSettings(**settings_update.dict(exclude_unset=True))
        await db.general_settings.insert_one(new_settings.dict())
        return new_settings
    
    update_data = {k: v for k, v in settings_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    await db.general_settings.update_one({}, {"$set": update_data})
    
    updated_settings = await db.general_settings.find_one()
    return GeneralSettings(**updated_settings)

@api_router.post("/settings/general/logo")
async def upload_logo(
    file: UploadFile = File(...),
    current_user: AdminUser = Depends(get_current_user)
):
    """Upload new logo"""
    # Save uploaded file
    logo_url = await save_uploaded_file(file, "logos")
    
    # Update general settings
    await db.general_settings.update_one(
        {},
        {"$set": {"logo_url": logo_url, "updated_at": datetime.now(timezone.utc)}},
        upsert=True
    )
    
    return {"message": "Logo uploaded successfully", "logo_url": logo_url}

# ============================================================================
# DASHBOARD ENDPOINTS
# ============================================================================

@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: AdminUser = Depends(get_current_user)):
    """Get dashboard statistics"""
    # Get stats
    total_leads = await db.leads.count_documents({})
    
    # Get today's enquiries
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_enquiries = await db.leads.count_documents({"created_at": {"$gte": today_start}})
    
    total_services = await db.services.count_documents({"is_active": True})
    total_gallery_images = await db.gallery.count_documents({"is_active": True})
    
    # Get recent leads (last 5)
    recent_leads_data = await db.leads.find().sort("created_at", -1).limit(5).to_list(5)
    recent_leads = [Lead(**lead) for lead in recent_leads_data]
    
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
    history = await db.login_history.find().sort("login_time", -1).limit(100).to_list(100)
    return [LoginHistory(**record) for record in history]

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
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
