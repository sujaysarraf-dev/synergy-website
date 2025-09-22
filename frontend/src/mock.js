// Mock data for SYNERGY INDIA website

export const companyInfo = {
  name: "SYNERGY INDIA",
  tagline: "Quality You Trust, Service You Deserve",
  taglineEn: "Civil • Agriculture • Solar — All Solutions Under One Roof",
  certification: "ISO 9001:2015 Certified",
  address: "05, Chaudhary Market, Opposite Paras HMRI Hospital, Raja Bazar, Patna - 800014",
  phone: "+916123597570",
  email: "info@synergyindia.com",
  whatsapp: "918507474141",
  website: "www.synergyindia.com",
  logo: "/photos/logo.jpg",
  ownerPhoto: "/photos/owner.png",
  officePhoto: "/photos/office.jpg"
};

export const companyPhotos = {
  ownerPhoto: "/photos/owner.png",
  officePhoto: "/photos/office.jpg",
  additionalPhotos: [
    "/photos/civil construction.jpg",
    "/photos/interior design.jpg",
    "/photos/solar plant installation.jpg"
  ]
};

export const services = [
  {
    id: 1,
    title: "Civil & Interior Work",
    titleEn: "Complete Civil & Interior Solutions",
    description: "Modern design and quality construction work from homes to commercial spaces.",
    descriptionHi: "आधुनिक डिजाइन और गुणवत्तापूर्ण निर्माण कार्य। घर से लेकर कमर्शियल स्पेस तक।",
    icon: "Building2",
    features: [
      "Residential Construction",
      "Interior Design & Fitout", 
      "Commercial Buildings",
      "Renovation & Remodeling",
      "Modular Kitchen",
      "False Ceiling & Lighting"
    ],
    pricing: {
      basic: { name: "Basic Package", price: "₹50,000", features: ["Basic Interior Design", "Standard Materials", "Basic Warranty"] },
      premium: { name: "Premium Package", price: "₹1,50,000", features: ["Premium Interior Design", "High-Quality Materials", "Extended Warranty", "Project Management"] },
      luxury: { name: "Luxury Package", price: "₹3,00,000", features: ["Luxury Interior Design", "Premium Materials", "Lifetime Support", "Dedicated Project Manager"] }
    },
    timeline: "15-45 days depending on project scope",
    warranty: "1 year construction warranty",
    image: "/photos/civil construction.jpg"
  },
  {
    id: 2,
    title: "Interior Design Services",
    titleEn: "Professional Interior Design Solutions",
    description: "Complete interior design services for residential and commercial spaces with modern aesthetics.",
    descriptionHi: "आधुनिक aesthetics के साथ residential और commercial spaces के लिए complete interior design services।",
    icon: "Building2",
    features: [
      "Home Interior Design",
      "Office Interior Design",
      "Modular Kitchen Design",
      "Wardrobe Design",
      "Living Room Design",
      "Bedroom Design"
    ],
    pricing: {
      basic: { name: "Basic Design", price: "₹30,000", features: ["Basic Design", "Material Selection", "Basic Consultation"] },
      premium: { name: "Premium Design", price: "₹80,000", features: ["Complete Design", "Premium Materials", "3D Visualization", "Project Management"] },
      luxury: { name: "Luxury Design", price: "₹1,50,000", features: ["Luxury Design", "High-End Materials", "Complete Execution", "After Sales Service"] }
    },
    timeline: "10-30 days design & execution",
    warranty: "2 years design warranty",
    image: "/photos/interior design.jpg"
  },
  {
    id: 3,
    title: "Agriculture Solutions", 
    titleEn: "Smart Agriculture & Farming Solutions",
    description: "Modern agricultural technology and equipment for comprehensive farming solutions.",
    descriptionHi: "आधुनिक कृषि तकनीक और उपकरण। किसानों की आय बढ़ाने के लिए समग्र समाधान।",
    icon: "Wheat",
    features: [
      "Solar Water Pumps",
      "Drip Irrigation Systems",
      "Greenhouse Solutions",
      "Agricultural Equipment",
      "Crop Advisory Services",
      "Government Scheme Support"
    ],
    pricing: {
      basic: { name: "Starter Farmer", price: "₹25,000", features: ["Basic Irrigation Setup", "Solar Pump", "Installation"] },
      premium: { name: "Smart Farmer", price: "₹75,000", features: ["Advanced Irrigation", "IoT Monitoring", "Crop Advisory", "Maintenance"] },
      luxury: { name: "Commercial Farm", price: "₹2,00,000", features: ["Complete Automation", "Advanced Analytics", "Expert Support", "Expansion Planning"] }
    },
    timeline: "7-21 days installation",
    warranty: "2-5 years equipment warranty",
    image: "/photos/drip irrigation system .jpg"
  },
  {
    id: 4,
    title: "Solar Equipment Suppliers",
    titleEn: "Complete Solar Energy Solutions", 
    description: "Complete range of solar energy systems with government subsidies and support.",
    descriptionHi: "सौर ऊर्जा सिस्टम की पूरी रेंज। सरकारी सब्सिडी के साथ किफायती समाधान।",
    icon: "Sun",
    features: [
      "Rooftop Solar Systems",
      "Solar Water Heaters", 
      "Solar Street Lights",
      "Solar Inverters & Batteries",
      "PM Surya Ghar Scheme Support",
      "Net Metering Assistance"
    ],
    pricing: {
      basic: { name: "Home Solar 1KW", price: "₹60,000", features: ["1KW Solar System", "Basic Installation", "Government Subsidy Support"] },
      premium: { name: "Home Solar 3KW", price: "₹1,80,000", features: ["3KW Solar System", "Premium Installation", "Net Metering", "5 Year Warranty"] },
      luxury: { name: "Commercial Solar 10KW", price: "₹6,00,000", features: ["10KW+ Solar System", "Commercial Installation", "Advanced Monitoring", "10 Year Support"] }
    },
    timeline: "5-15 days installation",
    warranty: "10-25 years system warranty",
    image: "/photos/solar plant installation.jpg"
  },
  {
    id: 5,
    title: "Commercial Construction",
    titleEn: "Commercial Building Construction",
    description: "Professional commercial construction services for offices, shops, and industrial buildings.",
    descriptionHi: "Offices, shops और industrial buildings के लिए professional commercial construction services।",
    icon: "Building2",
    features: [
      "Office Buildings",
      "Shopping Complexes",
      "Industrial Buildings",
      "Warehouse Construction",
      "Retail Spaces",
      "Commercial Renovation"
    ],
    pricing: {
      basic: { name: "Basic Construction", price: "₹2,000/sq ft", features: ["Basic Construction", "Standard Materials", "Basic Design"] },
      premium: { name: "Premium Construction", price: "₹3,500/sq ft", features: ["Premium Construction", "Quality Materials", "Custom Design", "Project Management"] },
      luxury: { name: "Luxury Construction", price: "₹5,000/sq ft", features: ["Luxury Construction", "Premium Materials", "Architectural Design", "Complete Turnkey"] }
    },
    timeline: "3-12 months depending on size",
    warranty: "5 years construction warranty",
    image: "/photos/civil construction.jpg"
  },
  {
    id: 6,
    title: "Solar Water Pump Systems",
    titleEn: "Solar Powered Water Pumping Solutions",
    description: "Efficient solar water pump systems for agriculture and domestic use with government subsidies.",
    descriptionHi: "कृषि और domestic use के लिए efficient solar water pump systems। सरकारी सब्सिडी के साथ।",
    icon: "Sun",
    features: [
      "Solar Submersible Pumps",
      "Surface Solar Pumps",
      "Solar Centrifugal Pumps",
      "Solar Borewell Pumps",
      "Government Subsidy Support",
      "Installation & Maintenance"
    ],
    pricing: {
      basic: { name: "1HP Solar Pump", price: "₹1,20,000", features: ["1HP Solar System", "Basic Installation", "1 Year Warranty"] },
      premium: { name: "3HP Solar Pump", price: "₹2,80,000", features: ["3HP Solar System", "Premium Installation", "3 Year Warranty", "Maintenance"] },
      luxury: { name: "5HP Solar Pump", price: "₹4,50,000", features: ["5HP Solar System", "Complete Installation", "5 Year Warranty", "Free Maintenance"] }
    },
    timeline: "3-7 days installation",
    warranty: "5 years system warranty",
    image: "/photos/solar plant installation.jpg"
  }
];

export const portfolioItems = [
  {
    id: 1,
    title: "Luxury Bedroom Interior",
    category: "Interior Design",
    location: "Patna, Bihar",
    year: "2024", 
    client: "Residential Client",
    projectValue: "₹2,50,000",
    duration: "30 days",
    description: "Complete bedroom interior design with modern wardrobe, marble finish and ambient lighting. Client satisfaction achieved with timely delivery.",
    challenge: "Limited space optimization",
    solution: "Custom corner wardrobe design with maximum storage",
    result: "30% more storage space with elegant design",
    image: "/photos/1.jpg"
  },
  {
    id: 2,
    title: "Entertainment Unit Design",
    category: "Interior Design", 
    location: "Muzaffarpur, Bihar",
    year: "2024",
    client: "Mr. Kumar Family",
    projectValue: "₹1,80,000",
    duration: "25 days",
    description: "Contemporary TV unit with marble backdrop and integrated storage solution for modern living room.",
    challenge: "Cable management and storage",
    solution: "Hidden cable management with integrated storage",
    result: "Clean, organized entertainment area",
    image: "/photos/2.jpg"
  },
  {
    id: 3,
    title: "Corner Wardrobe Solution",
    category: "Interior Design",
    location: "Patna, Bihar", 
    year: "2024",
    client: "Singh Family",
    projectValue: "₹1,20,000",
    duration: "20 days",
    description: "Space-optimized corner wardrobe with premium finish and smart storage solutions.",
    challenge: "Corner space utilization",
    solution: "Custom L-shaped wardrobe design",
    result: "Maximum storage in minimal space",
    image: "/photos/3.jpg"
  },
  {
    id: 4,
    title: "Modern Living Room Design",
    category: "Interior Design",
    location: "Gaya, Bihar",
    year: "2024", 
    client: "Sharma Residence",
    projectValue: "₹3,50,000",
    duration: "45 days",
    description: "Complete living room interior with marble feature wall, false ceiling and premium lighting design.",
    challenge: "Creating spacious feel in compact area",
    solution: "Strategic lighting and mirror placement",
    result: "Visually expanded space with luxury feel",
    image: "/photos/4.jpg"
  },
  {
    id: 5,
    title: "Solar Rooftop Installation",
    category: "Solar Energy",
    location: "Hajipur, Bihar",
    year: "2024",
    client: "Agricultural Farm",
    projectValue: "₹4,50,000",
    duration: "10 days",
    description: "5KW solar rooftop system for agricultural irrigation with government subsidy support.",
    challenge: "Rural area installation challenges",
    solution: "Specialized rural installation techniques",
    result: "60% reduction in electricity bills",
    image: "/photos/solar plant installation.jpg"
  },
  {
    id: 6,
    title: "Drip Irrigation System",
    category: "Agriculture",
    location: "Samastipur, Bihar",
    year: "2024",
    client: "Farmer Cooperative",
    projectValue: "₹1,25,000",
    duration: "7 days",
    description: "Modern drip irrigation system installation for 5-acre vegetable farming.",
    challenge: "Water scarcity and efficiency",
    solution: "Automated drip irrigation with timers",
    result: "40% water savings, 25% yield increase",
    image: "/photos/drip irrigation system .jpg"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Raj Kumar Singh",
    nameEn: "Raj Kumar Singh",
    location: "Patna, Bihar",
    rating: 5,
    text: "SYNERGY INDIA delivered exceptional interior design for our home. The quality and service were outstanding.",
    textHi: "SYNERGY INDIA ने हमारे घर का बेहतरीन interior design किया। Quality और service दोनों excellent थी।",
    service: "Interior Design",
    projectValue: "₹2,50,000",
    completionTime: "30 days"
  },
  {
    id: 2,
    name: "Sunita Devi", 
    nameEn: "Sunita Devi",
    location: "Bihar Sharif, Bihar",
    rating: 5,
    text: "Got solar system installed with government subsidy support. Very honest and reliable company with excellent customer service.",
    textHi: "Solar system लगवाया और government subsidy भी मिली। बहुत honest और reliable company है।",
    service: "Solar Installation",
    projectValue: "₹1,80,000",
    completionTime: "12 days"
  },
  {
    id: 3,
    name: "Vinod Kumar",
    nameEn: "Vinod Kumar",
    location: "Muzaffarpur, Bihar", 
    rating: 5,
    text: "As a farmer, I installed drip irrigation system from them. Water saving increased and crop yield also improved significantly.",
    textHi: "किसान हूँ और इनसे drip irrigation system लगवाया। पानी की बचत हो रही है और पैदावार भी बढ़ी है।",
    service: "Agriculture Solutions",
    projectValue: "₹75,000",
    completionTime: "8 days"
  },
  {
    id: 4,
    name: "Priya Sharma",
    nameEn: "Priya Sharma",
    location: "Darbhanga, Bihar",
    rating: 5,
    text: "Complete house interior work was done professionally. On-time delivery and excellent workmanship. Highly recommended!",
    textHi: "पूरे घर का interior work professionally किया गया। समय पर delivery और बेहतरीन workmanship। बहुत recommend करती हूं!",
    service: "Full Home Interior",
    projectValue: "₹4,50,000",
    completionTime: "60 days"
  },
  {
    id: 5,
    name: "Amit Jha",
    nameEn: "Amit Jha",
    location: "Begusarai, Bihar",
    rating: 5,
    text: "Commercial solar installation for our office building. Professional team, quality equipment, and excellent after-sales support.",
    textHi: "हमारे office building के लिए commercial solar installation की। Professional team, quality equipment और excellent after-sales support।",
    service: "Commercial Solar",
    projectValue: "₹8,50,000",
    completionTime: "20 days"
  },
  {
    id: 6,
    name: "Rekha Singh",
    nameEn: "Rekha Singh",
    location: "Chapra, Bihar",
    rating: 5,
    text: "Kitchen renovation work was completed beautifully. Modern design with traditional touch. Very satisfied with the results.",
    textHi: "Kitchen renovation का काम बहुत खूबसूरती से पूरा किया। Modern design with traditional touch। Results से बहुत खुश हैं।",
    service: "Kitchen Interior",
    projectValue: "₹1,25,000",
    completionTime: "18 days"
  }
];

export const teamMembers = [
  {
    id: 1,
    name: "Sanjay Kumar",
    nameEn: "Sanjay Kumar",
    position: "Founder & Managing Director",
    positionEn: "Founder & Managing Director",
    experience: "15+ Years Experience",
    experienceEn: "15+ Years Experience",
    specialization: "Civil Engineering & Project Management",
    specializationEn: "Civil Engineering & Project Management",
    description: "Expert in modern construction techniques and quality control systems",
    descriptionHi: "आधुनिक निर्माण तकनीक और गुणवत्ता नियंत्रण में विशेषज्ञ",
    education: "B.Tech Civil Engineering, NIT Patna",
    achievements: ["ISO 9001:2015 Implementation", "500+ Projects Completed", "Government Scheme Expert"],
    image: "/photos/owner.png"
  },
  {
    id: 2,
    name: "Priti Singh", 
    nameEn: "Priti Singh",
    position: "Head Interior Designer",
    positionEn: "Head Interior Designer",
    experience: "10+ Years Experience", 
    experienceEn: "10+ Years Experience",
    specialization: "Interior Design & Space Planning",
    specializationEn: "Interior Design & Space Planning",
    description: "Expert in residential and commercial interior design projects",
    descriptionHi: "Residential और commercial interior design में expert",
    education: "Masters in Interior Design, NIFT Delhi",
    achievements: ["200+ Interior Projects", "Award-Winning Designs", "Client Satisfaction 98%"],
    image: "/photos/p1.jpg"
  },
  {
    id: 3,
    name: "Rahul Sinha",
    nameEn: "Rahul Sinha",
    position: "Solar Technical Expert", 
    positionEn: "Solar Technical Expert",
    experience: "8+ Years Experience",
    experienceEn: "8+ Years Experience",
    specialization: "Solar Energy Systems & Government Subsidies",
    specializationEn: "Solar Energy Systems & Government Subsidies",
    description: "Specialist in solar energy systems and government subsidy schemes",
    descriptionHi: "सौर ऊर्जा सिस्टम और government schemes में specialist",
    education: "B.Tech Electrical Engineering, BIT Mesra",
    achievements: ["PM Surya Ghar Certified", "300+ Solar Installations", "Subsidy Success Rate 95%"],
    image: "/photos/p2.jpg"
  },
  {
    id: 4,
    name: "Dr. Anjali Kumari",
    nameEn: "Dr. Anjali Kumari",
    position: "Agriculture Consultant",
    positionEn: "Agriculture Consultant",
    experience: "12+ Years Experience",
    experienceEn: "12+ Years Experience",
    specialization: "Modern Agriculture & Crop Advisory",
    specializationEn: "Modern Agriculture & Crop Advisory",
    description: "Expert in modern farming techniques and agricultural technology",
    descriptionHi: "आधुनिक कृषि तकनीक और agricultural technology में expert",
    education: "PhD in Agriculture, BAU Ranchi",
    achievements: ["Krishi Vigyan Kendra Consultant", "Farmer Training Programs", "Sustainable Farming Advocate"],
    image: "/photos/p3.jpg"
  }
];

export const faqs = [
  {
    id: 1,
    question: "Do you provide warranty on your work?",
    questionHi: "क्या आप warranty देते हैं?",
    answer: "Yes, we provide 1 year warranty on all construction work and up to 5-10 years warranty on solar systems depending on the equipment.",
    answerHi: "हाँ, हम सभी construction work पर 1 साल की warranty देते हैं और solar systems पर 5-10 साल तक की warranty उपलब्ध है।"
  },
  {
    id: 2, 
    question: "What are your payment terms?",
    questionHi: "Payment terms क्या हैं?",
    answer: "Our payment structure is: 50% advance, 30% on work progress, and 20% on completion. EMI options are also available for larger projects.",
    answerHi: "50% advance, 30% work progress पर और 20% completion पर। EMI options भी उपलब्ध हैं।"
  },
  {
    id: 3,
    question: "Do you help with solar subsidies?", 
    questionHi: "Solar subsidy में help करते हैं?",
    answer: "Absolutely! We assist with PM Surya Ghar Scheme and other solar subsidies. We handle complete documentation and application process.",
    answerHi: "जी हाँ, हम PM Surya Ghar Scheme और अन्य solar subsidies के लिए पूरी documentation और application process में help करते हैं।"
  },
  {
    id: 4,
    question: "Which areas do you serve?",
    questionHi: "किस area में service देते हैं?",
    answer: "We provide services throughout Bihar and Jharkhand. Same-day site visits are possible in major cities like Patna, Muzaffarpur, and Gaya.",
    answerHi: "पूरे बिहार और झारखंड में हमारी services उपलब्ध हैं। Major cities में same-day visit भी possible है।"
  },
  {
    id: 5,
    question: "How long does project completion take?",
    questionHi: "Project completion में कितना समय लगता है?",
    answer: "Timeline varies by project: Interior work 15-45 days, Solar installation 5-15 days, Agriculture setup 7-21 days depending on scope.",
    answerHi: "Project के अनुसार समय अलग होता है: Interior work 15-45 दिन, Solar installation 5-15 दिन, Agriculture setup 7-21 दिन।"
  },
  {
    id: 6,
    question: "Do you provide free site surveys?",
    questionHi: "क्या free site survey करते हैं?",
    answer: "Yes, we provide free site surveys and consultations for all our services. Our technical team will visit your location to assess requirements.",
    answerHi: "जी हाँ, हम सभी services के लिए free site survey और consultation करते हैं। हमारी technical team आपके location पर visit करेगी।"
  }
];

export const solarSchemeInfo = {
  title: "PM Surya Ghar Muft Bijli Yojana",
  titleEn: "PM Surya Ghar Free Electricity Scheme",
  titleHi: "PM सूर्य घर मुफ्त बिजली योजना",
  description: "Under this government scheme, you get subsidy for installing solar rooftop system and can generate free electricity.",
  descriptionHi: "सरकार की इस योजना के तहत आपको solar rooftop system लगाने पर subsidy मिलती है।",
  officialLink: "https://www.india.gov.in/spotlight/pm-surya-ghar-muft-bijli-yojana",
  benefits: [
    { en: "Up to ₹30,000 subsidy on 1 KW system", hi: "1 KW सिस्टम पर ₹30,000 तक subsidy" },
    { en: "Up to ₹60,000 subsidy on 2 KW system", hi: "2 KW सिस्टम पर ₹60,000 तक subsidy" },
    { en: "Up to ₹78,000 subsidy on 3 KW or more", hi: "3 KW या अधिक पर ₹78,000 तक subsidy" },
    { en: "Up to 300 units free electricity every month", hi: "300 units तक free electricity हर महीने" },
    { en: "Benefits for 20-25 years", hi: "20-25 साल तक का benefit" }
  ],
  eligibility: [
    { en: "Must own the house", hi: "खुद का घर होना चाहिए" },
    { en: "Active electricity connection required", hi: "Electricity connection active होना चाहिए" },
    { en: "Sufficient roof space required", hi: "Roof पर sufficient space होना चाहिए" },
    { en: "Shadow-free area should be available", hi: "Shadow-free area उपलब्ध होना चाहिए" }
  ],
  documents: [
    { en: "Aadhaar Card", hi: "आधार कार्ड" },
    { en: "Electricity Bill", hi: "Electricity बिल" },
    { en: "House ownership proof", hi: "House ownership proof" },
    { en: "Bank account details", hi: "Bank account details" },
    { en: "Passport size photos", hi: "Passport size photos" }
  ],
  process: [
    { en: "Free site survey and feasibility check", hi: "Free site survey और feasibility check" },
    { en: "Application submission on government portal", hi: "Government portal पर application submit" },
    { en: "Technical approval and subsidy sanction", hi: "Technical approval और subsidy sanction" },
    { en: "Solar system installation", hi: "Solar system installation" },
    { en: "Net metering connection and commissioning", hi: "Net metering connection और commissioning" }
  ]
};