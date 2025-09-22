#!/usr/bin/env python3
"""
Data Migration Script for SYNERGY INDIA
Migrates mock data to MongoDB and creates initial admin user
"""

import asyncio
import os
import sys
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import hashlib
import uuid

# Add the backend directory to the path
sys.path.append(str(Path(__file__).parent))

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']

# Mock data (from frontend/src/mock.js)
COMPANY_INFO = {
    "name": "SYNERGY INDIA",
    "tagline": "Quality You Trust, Service You Deserve",
    "certification": "ISO 9001:2015 Certified",
    "address": "05, Chaudhary Market, Opposite Paras HMRI Hospital, Raja Bazar, Patna - 800014",
    "phone": "+91-8404861022",
    "email": "info@synergyindia.com",
    "whatsapp": "918404861022",
    "website": "www.synergyindia.com",
    "logo": "https://customer-assets.emergentagent.com/job_4e865656-4cd3-4df9-b985-379e174ef909/artifacts/e98t14ka_WhatsApp%20Image%202025-09-16%20at%2018.19.38_99f24a69.jpg"
}

SERVICES_DATA = [
    {
        "id": str(uuid.uuid4()),
        "title": "Civil & Interior Work",
        "overview": "Modern design and quality construction work from homes to commercial spaces. We provide comprehensive civil and interior solutions with professional execution.",
        "sub_services": [
            "Residential Construction",
            "Interior Design & Fitout",
            "Commercial Buildings",
            "Renovation & Remodeling",
            "Modular Kitchen",
            "False Ceiling & Lighting"
        ],
        "benefits": [
            "15+ years of experience",
            "Quality materials and workmanship",
            "Timely project completion",
            "1 year construction warranty",
            "Professional project management",
            "Customer satisfaction guaranteed"
        ],
        "cta_text": "Get Your Dream Space Designed Today",
        "images": [
            "https://customer-assets.emergentagent.com/job_4e865656-4cd3-4df9-b985-379e174ef909/artifacts/nm66vehg_WhatsApp%20Image%202025-09-16%20at%2018.23.04_1a8773c7.jpg"
        ],
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Agriculture Solutions",
        "overview": "Modern agricultural technology and equipment for comprehensive farming solutions. Smart farming solutions to increase crop yield and reduce costs.",
        "sub_services": [
            "Solar Water Pumps",
            "Drip Irrigation Systems",
            "Greenhouse Solutions",
            "Agricultural Equipment",
            "Crop Advisory Services",
            "Government Scheme Support"
        ],
        "benefits": [
            "40% water savings with drip irrigation",
            "25% increase in crop yield",
            "Government subsidy support",
            "Expert crop advisory services",
            "2-5 years equipment warranty",
            "Cost-effective farming solutions"
        ],
        "cta_text": "Transform Your Farming Today",
        "images": [],
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Solar Equipment Suppliers",
        "overview": "Complete range of solar energy systems with government subsidies and support. Reduce your electricity bills by up to 90% with our solar solutions.",
        "sub_services": [
            "Rooftop Solar Systems",
            "Solar Water Heaters",
            "Solar Street Lights", 
            "Solar Inverters & Batteries",
            "PM Surya Ghar Scheme Support",
            "Net Metering Assistance"
        ],
        "benefits": [
            "Up to 90% reduction in electricity bills",
            "Government subsidy up to ₹78,000",
            "10-25 years system warranty",
            "Professional installation",
            "Net metering support",
            "ROI within 3-4 years"
        ],
        "cta_text": "Go Solar, Save Money Today",
        "images": [],
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
]

GALLERY_DATA = [
    {
        "id": str(uuid.uuid4()),
        "url": "https://customer-assets.emergentagent.com/job_4e865656-4cd3-4df9-b985-379e174ef909/artifacts/9r5c5vze_a-photograph-showcases-a-modern-open-pla_nmrPVymmRZq8Gnj29-BzOg_ZK6VdzIJSHqcq6MFddDA-Q.jpeg",
        "alt_text": "Modern open plan construction project by Synergy India",
        "caption": "Civil Construction",
        "category": "Construction",
        "order": 1,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "url": "https://customer-assets.emergentagent.com/job_4e865656-4cd3-4df9-b985-379e174ef909/artifacts/h2d56y30_a-series-of-four-ultra-realistic-product_VenNUFdxTMKGUTBQM8x23g_Aagye9OzTG-seyfaCuWKVA.jpeg",
        "alt_text": "Professional renovation and remodeling work by Synergy India",
        "caption": "Renovation & Remodeling",
        "category": "Renovation",
        "order": 2,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "url": "https://customer-assets.emergentagent.com/job_4e865656-4cd3-4df9-b985-379e174ef909/artifacts/rfvylfiq_a-photograph-showcasing-a-modern-living-_JIP0DqwNQ0aOyaqU6-F9Dg_SuIh-SoCT6qXhm8tamBcbg.jpeg",
        "alt_text": "Modern living room interior design by Synergy India",
        "caption": "Interior Design & Execution",
        "category": "Interior Design",
        "order": 3,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "url": "https://customer-assets.emergentagent.com/job_4e865656-4cd3-4df9-b985-379e174ef909/artifacts/ilvh42m8_generate-4-ultra-realistic-high-resoluti_DirmgR7QSAW6aJqcasQFow_5akk_WKjReKBMRzB56ALJw.jpeg",
        "alt_text": "Premium finishing and aesthetic works by Synergy India",
        "caption": "Finishing & Aesthetic Works",
        "category": "Finishing",
        "order": 4,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "url": "https://customer-assets.emergentagent.com/job_4e865656-4cd3-4df9-b985-379e174ef909/artifacts/7hk7urn9_generate-4-ultra-realistic-high-resoluti_2QRz-CaUSNuEtwKQR4ZrNg_RHaL1QIQR3eLnA8ydeLs2g.jpeg",
        "alt_text": "Professional commercial interior design by Synergy India",
        "caption": "Commercial Interiors",
        "category": "Commercial",
        "order": 5,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "url": "https://customer-assets.emergentagent.com/job_4e865656-4cd3-4df9-b985-379e174ef909/artifacts/nm66vehg_WhatsApp%20Image%202025-09-16%20at%2018.23.04_1a8773c7.jpg",
        "alt_text": "Luxury bedroom interior with modern wardrobe design",
        "caption": "Luxury Bedroom Interior",
        "category": "Interior Design",
        "order": 6,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "url": "https://customer-assets.emergentagent.com/job_4e865656-4cd3-4df9-b985-379e174ef909/artifacts/kgo2rj5q_WhatsApp%20Image%202025-09-16%20at%2018.23.05_e8b9171d.jpg",
        "alt_text": "Contemporary TV unit with marble backdrop",
        "caption": "Entertainment Unit Design",
        "category": "Interior Design",
        "order": 7,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "url": "https://customer-assets.emergentagent.com/job_4e865656-4cd3-4df9-b985-379e174ef909/artifacts/onzft4wm_WhatsApp%20Image%202025-09-16%20at%2018.23.03_25a92dab.jpg",
        "alt_text": "Space-optimized corner wardrobe solution",
        "caption": "Corner Wardrobe Solution",
        "category": "Interior Design",
        "order": 8,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "url": "https://customer-assets.emergentagent.com/job_4e865656-4cd3-4df9-b985-379e174ef909/artifacts/6cr1plkw_WhatsApp%20Image%202025-09-16%20at%2018.23.03_d720cf08.jpg",
        "alt_text": "Modern living room with marble feature wall",
        "caption": "Living Room Interior",
        "category": "Interior Design",
        "order": 9,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
]

def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

async def migrate_data():
    """Migrate all data to MongoDB"""
    print("🚀 Starting data migration...")
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        # 1. Create admin user
        print("👤 Creating admin user...")
        admin_user = {
            "id": str(uuid.uuid4()),
            "username": "admin",
            "hashed_password": hash_password("admin123"),
            "created_at": datetime.now(timezone.utc),
            "last_login": None
        }
        
        # Check if admin already exists
        existing_admin = await db.admin_users.find_one({"username": "admin"})
        if not existing_admin:
            await db.admin_users.insert_one(admin_user)
            print("✅ Admin user created (username: admin, password: admin123)")
        else:
            print("ℹ️ Admin user already exists")
        
        # 2. Migrate services
        print("🏗️ Migrating services...")
        await db.services.delete_many({})  # Clear existing
        await db.services.insert_many(SERVICES_DATA)
        print(f"✅ Migrated {len(SERVICES_DATA)} services")
        
        # 3. Migrate gallery images
        print("🖼️ Migrating gallery images...")
        await db.gallery.delete_many({})  # Clear existing
        await db.gallery.insert_many(GALLERY_DATA)
        print(f"✅ Migrated {len(GALLERY_DATA)} gallery images")
        
        # 4. Create default settings
        print("⚙️ Creating default settings...")
        
        # Contact form settings
        contact_form_settings = {
            "id": str(uuid.uuid4()),
            "service_options": ["Civil & Interior Work", "Agriculture Solutions", "Solar Equipment"],
            "project_type_options": ["Residential", "Commercial", "Agricultural", "Industrial"],
            "admin_email": COMPANY_INFO["email"],
            "whatsapp_number": COMPANY_INFO["whatsapp"],
            "updated_at": datetime.now(timezone.utc)
        }
        await db.contact_form_settings.delete_many({})
        await db.contact_form_settings.insert_one(contact_form_settings)
        
        # CTA settings
        cta_settings = {
            "id": str(uuid.uuid4()),
            "whatsapp_template": "Hello! I would like to know about {service_name} services.",
            "call_number": COMPANY_INFO["phone"],
            "contact_page_link": "/contact",
            "updated_at": datetime.now(timezone.utc)
        }
        await db.cta_settings.delete_many({})
        await db.cta_settings.insert_one(cta_settings)
        
        # General settings
        general_settings = {
            "id": str(uuid.uuid4()),
            "site_name": COMPANY_INFO["name"],
            "logo_url": COMPANY_INFO["logo"],
            "office_address": COMPANY_INFO["address"],
            "phone": COMPANY_INFO["phone"],
            "email": COMPANY_INFO["email"],
            "office_hours": "Mon-Sat: 9 AM - 6 PM",
            "social_media": {
                "facebook": "",
                "instagram": "",
                "twitter": "",
                "linkedin": ""
            },
            "updated_at": datetime.now(timezone.utc)
        }
        await db.general_settings.delete_many({})
        await db.general_settings.insert_one(general_settings)
        
        print("✅ Default settings created")
        
        # 5. Create sample leads (optional)
        print("📝 Creating sample leads...")
        sample_leads = [
            {
                "id": str(uuid.uuid4()),
                "name": "Raj Kumar Singh",
                "phone": "+91-9876543210",
                "email": "raj.singh@example.com",
                "service_interested": "Civil & Interior Work",
                "project_type": "Residential",
                "message": "I need interior design for my 3BHK apartment in Patna.",
                "status": "New",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Sunita Devi",
                "phone": "+91-9876543211",
                "email": "sunita.devi@example.com",
                "service_interested": "Solar Equipment",
                "project_type": "Residential",
                "message": "Want to install solar panels with government subsidy.",
                "status": "In Progress",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            }
        ]
        
        await db.leads.delete_many({})
        await db.leads.insert_many(sample_leads)
        print(f"✅ Created {len(sample_leads)} sample leads")
        
        print("\n🎉 Data migration completed successfully!")
        print("\n📋 Summary:")
        print(f"   • Admin user: username='admin', password='admin123'")
        print(f"   • Services: {len(SERVICES_DATA)} migrated")
        print(f"   • Gallery images: {len(GALLERY_DATA)} migrated")
        print(f"   • Sample leads: {len(sample_leads)} created")
        print(f"   • Default settings created")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        raise
    
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(migrate_data())