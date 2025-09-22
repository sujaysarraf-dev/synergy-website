import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Building2,
  Wheat,
  Sun,
  Award,
  Phone,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { services } from '../mock';

export const Services = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Use mock data directly - no backend calls needed
  const servicesData = services;
  
  const handleWhatsAppClick = (serviceName = '') => {
    const message = serviceName 
      ? `Hi, I am interested in your ${serviceName} services`
      : 'Hi, I am interested in your services';
    window.open(`https://wa.me/918507474141?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = 'tel:+916123597570';
  };

  // Group services by category using mock data
  const groupServicesByCategory = (services) => {
    const categories = {
      all: {
        title: 'All Services',
        description: 'Complete range of our professional services',
        services: services
      },
      civil: {
        title: 'Civil & Interior Work',
        description: 'Complete solutions for construction and interior design',
        services: []
      },
      agriculture: {
        title: 'Agriculture Solutions', 
        description: 'Modern farming technology and equipment',
        services: []
      },
      solar: {
        title: 'Solar Equipment',
        description: 'Clean energy solutions with government subsidies',
        services: []
      }
    };

    services.forEach(service => {
      const title = service.title.toLowerCase();
      if (title.includes('civil') || title.includes('interior') || title.includes('commercial construction')) {
        categories.civil.services.push(service);
      } else if (title.includes('agriculture') || title.includes('water pump')) {
        categories.agriculture.services.push(service);
      } else if (title.includes('solar equipment')) {
        categories.solar.services.push(service);
      } else {
        // Default to civil if not categorized
        categories.civil.services.push(service);
      }
    });

    return categories;
  };

  const serviceCategories = groupServicesByCategory(servicesData);

  const pageContent = {
    title: language === 'hi' ? 'हमारी सेवाएं' : 'Our Services',
    subtitle: language === 'hi' 
      ? 'आधुनिक तकनीक के साथ गुणवत्तापूर्ण सेवाएं' 
      : 'Quality services with modern technology'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-red-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="border-white/30 text-white mb-4 bg-white/10 backdrop-blur-sm">
              <Award className="h-3 w-3 mr-1" />
              Certified Professional Services
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold">
              {pageContent.title}
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              {pageContent.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Services Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            {/* Category Navigation */}
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-lg grid-cols-4 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="all" 
                  className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">{language === 'hi' ? 'सभी' : 'All'}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="civil" 
                  className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">{language === 'hi' ? 'सिविल' : 'Civil'}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="agriculture" 
                  className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  <Wheat className="h-4 w-4" />
                  <span className="hidden sm:inline">{language === 'hi' ? 'कृषि' : 'Agriculture'}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="solar" 
                  className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  <Sun className="h-4 w-4" />
                  <span className="hidden sm:inline">{language === 'hi' ? 'सोलर' : 'Solar'}</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Category Content */}
            {Object.entries(serviceCategories).map(([key, category]) => (
              <TabsContent key={key} value={key} className="space-y-8">
                {/* Category Header */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {category.title}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {category.description}
                  </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.services.map((service) => (
                    <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white">
                      {/* Service Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={service.image || 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                          } 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="font-semibold text-lg">{service.title}</h3>
                        </div>
                      </div>

                      {/* Service Content */}
                      <CardContent className="p-6">
                        {/* Short Intro */}
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed line-clamp-3">
                          {service.description || 'Professional service with quality and expertise.'}
                        </p>
                        
                        {/* Buttons */}
                        <div className="flex space-x-2">
                          <Link to={`/services/${service.id}`} className="flex-1">
                            <Button className="w-full bg-orange-600 hover:bg-orange-700">
                              {language === 'hi' ? 'विवरण देखें' : 'View Details'}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleWhatsAppClick(service.title)}
                            className="border-green-600 text-green-600 hover:bg-green-50"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Empty State */}
                {category.services.length === 0 && (
                  <div className="text-center py-16">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {language === 'hi' ? 'कोई सेवा उपलब्ध नहीं' : 'No Services Available'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'hi' ? 'इस श्रेणी में जल्द ही सेवाएं जोड़ी जाएंगी।' : 'Services will be added to this category soon.'}
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  );
};

