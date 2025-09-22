import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  BarChart3,
  Users,
  Building,
  MessageCircle,
  Calendar,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Upload,
  Download,
  Home,
  Image,
  Phone,
  Mail,
  MapPin,
  Globe,
  Save,
  X,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State for data
  const [dashboardStats, setDashboardStats] = useState(null);
  const [services, setServices] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [settings, setSettings] = useState({});

  // Modal states
  const [serviceModal, setServiceModal] = useState({ open: false, data: null });
  const [galleryModal, setGalleryModal] = useState({ open: false, data: null });
  const [leadModal, setLeadModal] = useState({ open: false, data: null });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      toast.error('Please login to access admin panel');
      navigate('/admin/login');
      return;
    }
    
    setAdminUser(JSON.parse(user));
    loadDashboardData();
  }, [navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const getBackendUrl = () => {
    return process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data for now - bypass backend calls
      setDashboardStats({
        total_leads: 25,
        today_enquiries: 3,
        total_services: 3,
        total_gallery_images: 12,
        recent_leads: [
          {
            id: 1,
            name: 'Rajesh Kumar',
            service_interested: 'Solar Installation',
            phone: '+91-9876543210',
            status: 'New'
          },
          {
            id: 2,
            name: 'Priya Singh',
            service_interested: 'Interior Design',
            phone: '+91-9876543211',
            status: 'In Progress'
          },
          {
            id: 3,
            name: 'Amit Verma',
            service_interested: 'Drip Irrigation',
            phone: '+91-9876543212',
            status: 'New'
          }
        ]
      });

      // Mock services data
      setServices([
        {
          id: 1,
          title: 'Civil & Interior Work',
          short_intro: 'Complete construction and interior solutions',
          overview: 'Modern design and quality construction work from homes to commercial spaces.',
          sub_services: ['Residential Construction', 'Interior Design', 'Commercial Buildings'],
          benefits: ['Quality Materials', 'Expert Team', 'Timely Delivery'],
          cta_text: 'Get Quote Now',
          is_active: true,
          images: []
        },
        {
          id: 2,
          title: 'Agriculture Solutions',
          short_intro: 'Smart farming and irrigation systems',
          overview: 'Modern agricultural technology and equipment for comprehensive farming solutions.',
          sub_services: ['Solar Water Pumps', 'Drip Irrigation', 'Greenhouse Solutions'],
          benefits: ['Water Saving', 'Higher Yield', 'Government Subsidy'],
          cta_text: 'Learn More',
          is_active: true,
          images: []
        },
        {
          id: 3,
          title: 'Solar Equipment Suppliers',
          short_intro: 'Complete solar energy solutions',
          overview: 'Complete range of solar energy systems with government subsidies and support.',
          sub_services: ['Rooftop Solar', 'Solar Water Heaters', 'Solar Street Lights'],
          benefits: ['Government Subsidy', 'Net Metering', 'Long Warranty'],
          cta_text: 'Get Quote',
          is_active: true,
          images: []
        }
      ]);

      // Mock gallery data
      setGalleryImages([
        {
          id: 1,
          url: '/photos/1.jpg',
          alt_text: 'Luxury Bedroom Interior',
          category: 'Interior Design',
          caption: 'Modern bedroom design with premium finish'
        },
        {
          id: 2,
          url: '/photos/2.jpg',
          alt_text: 'Entertainment Unit Design',
          category: 'Interior Design',
          caption: 'Contemporary TV unit with marble backdrop'
        },
        {
          id: 3,
          url: '/photos/3.jpg',
          alt_text: 'Corner Wardrobe Solution',
          category: 'Interior Design',
          caption: 'Space-optimized corner wardrobe'
        },
        {
          id: 4,
          url: '/photos/4.jpg',
          alt_text: 'Modern Living Room',
          category: 'Interior Design',
          caption: 'Complete living room interior design'
        },
        {
          id: 5,
          url: '/photos/solar plant installation.jpg',
          alt_text: 'Solar Rooftop Installation',
          category: 'Solar Energy',
          caption: '5KW solar rooftop system installation'
        },
        {
          id: 6,
          url: '/photos/drip irrigation system .jpg',
          alt_text: 'Drip Irrigation System',
          category: 'Agriculture',
          caption: 'Modern drip irrigation for farming'
        }
      ]);

      // Mock leads data
      setLeads([
        {
          id: 1,
          name: 'Rajesh Kumar',
          phone: '+91-9876543210',
          email: 'rajesh@email.com',
          service_interested: 'Solar Installation',
          project_type: 'Residential',
          status: 'New'
        },
        {
          id: 2,
          name: 'Priya Singh',
          phone: '+91-9876543211',
          email: 'priya@email.com',
          service_interested: 'Interior Design',
          project_type: 'Home Renovation',
          status: 'In Progress'
        },
        {
          id: 3,
          name: 'Amit Verma',
          phone: '+91-9876543212',
          email: 'amit@email.com',
          service_interested: 'Drip Irrigation',
          project_type: 'Agricultural Farm',
          status: 'New'
        }
      ]);

      // Mock settings
      setSettings({
        company_name: 'SYNERGY INDIA',
        contact_email: 'info@synergyindia.com',
        contact_phone: '+916123597570'
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: Building },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'contact-settings', label: 'Contact Form', icon: MessageCircle },
    { id: 'cta-settings', label: 'CTA Settings', icon: Phone },
    { id: 'general-settings', label: 'General Settings', icon: Settings },
    { id: 'backup', label: 'Backup', icon: Download }
  ];

  const exportLeadsCSV = async () => {
    try {
      // Mock CSV export - create sample CSV content
      const csvContent = "Name,Phone,Email,Service,Project Type,Status\nRajesh Kumar,+91-9876543210,rajesh@email.com,Solar Installation,Residential,New\nPriya Singh,+91-9876543211,priya@email.com,Interior Design,Home Renovation,In Progress\nAmit Verma,+91-9876543212,amit@email.com,Drip Irrigation,Agricultural Farm,New";
        
        // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
      a.download = 'leads_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast.success('Leads exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export leads');
    }
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-lg font-bold text-gray-900">SYNERGY ADMIN</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentSection(item.id)}
                    className={`w-full flex items-center ${sidebarOpen ? 'px-4' : 'px-2'} py-3 rounded-lg transition-colors ${
                      currentSection === item.id
                        ? 'bg-orange-100 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span className="ml-3">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className={`w-full ${sidebarOpen ? '' : 'px-2'} border-red-600 text-red-600 hover:bg-red-50`}
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {sidebarItems.find(item => item.id === currentSection)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div>
                <p className="text-sm font-medium text-gray-900">{adminUser.name}</p>
                <p className="text-xs text-gray-500">{adminUser.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <>
              {/* Dashboard Section */}
              {currentSection === 'dashboard' && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Leads</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {dashboardStats?.total_leads || 0}
                            </p>
                          </div>
                          <Users className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Today's Enquiries</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {dashboardStats?.today_enquiries || 0}
                            </p>
                          </div>
                          <MessageCircle className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Active Services</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {dashboardStats?.total_services || 0}
                            </p>
                          </div>
                          <Building className="h-8 w-8 text-orange-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Gallery Images</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {dashboardStats?.total_gallery_images || 0}
                            </p>
                          </div>
                          <Image className="h-8 w-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Shortcuts to common tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button 
                          onClick={() => setCurrentSection('services')}
                          className="h-16 bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Add Service
                        </Button>
                        <Button 
                          onClick={() => setCurrentSection('gallery')}
                          className="h-16 bg-green-600 hover:bg-green-700"
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Add Gallery Image
                        </Button>
                        <Button 
                          onClick={() => setCurrentSection('leads')}
                          className="h-16 bg-purple-600 hover:bg-purple-700"
                        >
                          <Eye className="h-5 w-5 mr-2" />
                          View Leads
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Leads */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Leads</CardTitle>
                      <CardDescription>Latest customer inquiries</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboardStats?.recent_leads?.slice(0, 5).map((lead) => (
                          <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-semibold text-gray-900">{lead.name}</p>
                              <p className="text-sm text-gray-600">{lead.service_interested}</p>
                              <p className="text-xs text-gray-500">{lead.phone}</p>
                            </div>
                            <Badge 
                              variant={lead.status === 'New' ? 'default' : 
                                     lead.status === 'In Progress' ? 'secondary' : 'outline'}
                            >
                              {lead.status}
                            </Badge>
                          </div>
                        )) || (
                          <p className="text-gray-500 text-center py-4">No recent leads</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Services Management */}
              {currentSection === 'services' && (
                <ServiceManagement 
                  services={services}
                  onUpdate={loadDashboardData}
                  getAuthHeaders={getAuthHeaders}
                  getBackendUrl={getBackendUrl}
                />
              )}

              {/* Gallery Management */}
              {currentSection === 'gallery' && (
                <GalleryManagement 
                  images={galleryImages}
                  onUpdate={loadDashboardData}
                  getAuthHeaders={getAuthHeaders}
                  getBackendUrl={getBackendUrl}
                />
              )}

              {/* Leads Management */}
              {currentSection === 'leads' && (
                <LeadsManagement 
                  leads={leads}
                  onUpdate={loadDashboardData}
                  onExport={exportLeadsCSV}
                  getAuthHeaders={getAuthHeaders}
                  getBackendUrl={getBackendUrl}
                />
              )}

              {/* Settings Sections */}
              {(currentSection === 'contact-settings' || 
                currentSection === 'cta-settings' || 
                currentSection === 'general-settings') && (
                <SettingsManagement 
                  section={currentSection}
                  settings={settings}
                  onUpdate={loadDashboardData}
                  getAuthHeaders={getAuthHeaders}
                  getBackendUrl={getBackendUrl}
                />
              )}

              {/* Backup Section */}
              {currentSection === 'backup' && (
                <BackupManagement 
                  getAuthHeaders={getAuthHeaders}
                  getBackendUrl={getBackendUrl}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// Services Management Component
const ServiceManagement = ({ services, onUpdate, getAuthHeaders, getBackendUrl }) => {
  const [editingService, setEditingService] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    short_intro: '',
    overview: '',
    sub_services: [],
    benefits: [],
    cta_text: '',
    is_active: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mock service save - for now just show success message
        toast.success(`Service ${editingService ? 'updated' : 'created'} successfully`);
        setEditingService(null);
        setFormData({
          title: '',
          short_intro: '',
          overview: '',
          sub_services: [],
          benefits: [],
          cta_text: '',
          is_active: true
        });
      // Note: In real implementation, you would call onUpdate() to refresh data
    } catch (error) {
      console.error('Service save error:', error);
      toast.error('Failed to save service');
    }
  };

  const handleImageUpload = async (serviceId, files) => {
    if (!files || files.length === 0) return;
    
    setUploadingImages(true);
    
    // Mock image upload - for now just show success message
    setTimeout(() => {
      toast.success(`Images uploaded successfully`);
    setUploadingImages(false);
    }, 1000);
    
    // Note: In real implementation, you would upload files and call onUpdate()
  };

  const handleImageRemove = async (serviceId, imageUrl) => {
    if (!window.confirm('Are you sure you want to remove this image?')) return;

    try {
      // Mock image removal - for now just show success message
        toast.success('Image removed successfully');
      // Note: In real implementation, you would call onUpdate() to refresh data
    } catch (error) {
      console.error('Image remove error:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      short_intro: service.short_intro || '',
      overview: service.overview,
      sub_services: service.sub_services,
      benefits: service.benefits,
      cta_text: service.cta_text,
      is_active: service.is_active
    });
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      // Mock service deletion - for now just show success message
        toast.success('Service deleted successfully');
      // Note: In real implementation, you would call onUpdate() to refresh data
    } catch (error) {
      console.error('Service delete error:', error);
      toast.error('Failed to delete service');
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingService ? 'Edit Service' : 'Add New Service'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="short_intro">Short Intro (for service cards)</Label>
              <Textarea
                id="short_intro"
                value={formData.short_intro}
                onChange={(e) => setFormData({...formData, short_intro: e.target.value})}
                rows={2}
                placeholder="Brief 1-2 line description for service cards"
              />
            </div>
            
            <div>
              <Label htmlFor="overview">Overview (for detail page) *</Label>
              <Textarea
                id="overview"
                value={formData.overview}
                onChange={(e) => setFormData({...formData, overview: e.target.value})}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="sub_services">Sub-services (comma separated)</Label>
              <Textarea
                id="sub_services"
                value={formData.sub_services.join(', ')}
                onChange={(e) => setFormData({...formData, sub_services: e.target.value.split(', ').filter(s => s.trim())})}
                rows={2}
                placeholder="Service 1, Service 2, Service 3"
              />
            </div>

            <div>
              <Label htmlFor="benefits">Benefits (comma separated)</Label>
              <Textarea
                id="benefits"
                value={formData.benefits.join(', ')}
                onChange={(e) => setFormData({...formData, benefits: e.target.value.split(', ').filter(s => s.trim())})}
                rows={2}
                placeholder="Benefit 1, Benefit 2, Benefit 3"
              />
            </div>

            <div>
              <Label htmlFor="cta_text">CTA Text *</Label>
              <Input
                id="cta_text"
                value={formData.cta_text}
                onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
                placeholder="Get Quote Now"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              />
              <Label htmlFor="is_active">Show on website</Label>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                <Save className="h-4 w-4 mr-2" />
                {editingService ? 'Update Service' : 'Create Service'}
              </Button>
              {editingService && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setEditingService(null);
                    setFormData({
                      title: '',
                      short_intro: '',
                      overview: '',
                      sub_services: [],
                      benefits: [],
                      cta_text: '',
                      is_active: true
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle>All Services ({services.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{service.title}</h3>
                    <p className="text-gray-600 mt-1">{service.overview}</p>
                    <div className="mt-2">
                      <Badge variant={service.is_active ? 'default' : 'secondary'}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Service Images Section */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">
                      Service Images ({service.images?.length || 0}/4)
                    </h4>
                    <div className="flex space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(service.id, e.target.files)}
                        disabled={uploadingImages || (service.images?.length >= 4)}
                        className="hidden"
                        id={`image-upload-${service.id}`}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => document.getElementById(`image-upload-${service.id}`).click()}
                        disabled={uploadingImages || (service.images?.length >= 4)}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        {uploadingImages ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-3 w-3 mr-1" />
                            Add Images
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Display Images */}
                  {service.images && service.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {service.images.map((imageUrl, index) => (
                        <div key={index} className="relative border rounded-lg overflow-hidden">
                          <img 
                            src={imageUrl} 
                            alt={`${service.title} image ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <button
                            onClick={() => handleImageRemove(service.id, imageUrl)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No images uploaded</p>
                      <p className="text-gray-400 text-xs">Upload up to 4 images (max 1MB each)</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Gallery Management Component (Static Images)
const GalleryManagement = ({ images, onUpdate, getAuthHeaders, getBackendUrl }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gallery Management</CardTitle>
          <CardDescription>
            Gallery images are automatically loaded from the photos directory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Static Gallery Images
                </h3>
                <p className="text-sm text-blue-600">
                  Images are automatically loaded from the backend/photos directory. 
                  To add new images, place them in the photos folder and refresh the page.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery Images ({images.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.alt_text}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <p className="font-semibold">{image.alt_text}</p>
                    <p className="text-sm text-gray-600">{image.category}</p>
                    <p className="text-xs text-gray-500 mt-1">{image.caption}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="default">Active</Badge>
                      <span className="text-xs text-gray-400">Static Image</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Found</h3>
              <p className="text-gray-500">
                Place images in the backend/photos directory to see them here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Leads Management Component
const LeadsManagement = ({ leads, onUpdate, onExport, getAuthHeaders, getBackendUrl }) => {
  const [filter, setFilter] = useState('All');

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      // Mock status update - for now just show success message
        toast.success('Lead status updated');
      // Note: In real implementation, you would call onUpdate() to refresh data
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update lead status');
    }
  };

  const filteredLeads = filter === 'All' ? leads : leads.filter(lead => lead.status === filter);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {['All', 'New', 'In Progress', 'Closed'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
        <Button onClick={onExport} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leads ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.project_type}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{lead.phone}</p>
                        {lead.email && <p className="text-sm text-gray-500">{lead.email}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {lead.service_interested}
                    </td>
                    <td className="px-6 py-4">
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusUpdate(lead.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(`tel:${lead.phone}`)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Settings Management Component
const SettingsManagement = ({ section, settings, onUpdate, getAuthHeaders, getBackendUrl }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {section === 'contact-settings' && 'Contact Form Settings'}
            {section === 'cta-settings' && 'CTA Button Settings'}
            {section === 'general-settings' && 'General Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Settings management interface will be implemented here.
            Current settings: {JSON.stringify(settings, null, 2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Backup Management Component
const BackupManagement = ({ getAuthHeaders, getBackendUrl }) => {
  const [backupLoading, setBackupLoading] = useState(false);

  const handleManualBackup = async () => {
    setBackupLoading(true);
    try {
      // Mock backup - for now just show success message
      setTimeout(() => {
        toast.success('Backup initiated successfully');
        setBackupLoading(false);
      }, 2000);
      // Note: In real implementation, you would call the backup API
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('Failed to initiate backup');
    setBackupLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manual Backup</CardTitle>
          <CardDescription>Create a backup of all system data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleManualBackup}
            disabled={backupLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {backupLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Backup...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Create Manual Backup
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security & Login History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Login history and security logs will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};