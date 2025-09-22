import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft,
  Phone,
  MessageCircle,
  ChevronLeft
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { services } from '../mock';

export const ServiceDetail = () => {
  const { slug } = useParams(); // This will be the service ID
  const { language } = useLanguage();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Find service from mock data - no backend calls needed
  useEffect(() => {
    const serviceId = parseInt(slug);
    const foundService = services.find(s => s.id === serviceId);
    
    if (foundService) {
      setService(foundService);
    } else {
      setError('Service not found');
    }
    
    setLoading(false);
  }, [slug]);

  const handleWhatsAppClick = () => {
    const message = `Hi, I am interested in your ${service?.title || 'services'} service`;
    window.open(`https://wa.me/918507474141?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = 'tel:+916123597570';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
          <span>Loading service details...</span>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested service could not be found.'}</p>
          <Link to="/services">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/services" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {language === 'hi' ? 'सेवाओं पर वापस जाएं' : 'Back to Services'}
          </Link>
        </div>
      </section>

      {/* Service Image */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative h-64 md:h-96 overflow-hidden rounded-lg shadow-lg">
            <img 
              src={service.image || 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
              } 
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <Badge className="bg-orange-600 text-white mb-2">
                {language === 'hi' ? 'पेशेवर सेवा' : 'Professional Service'}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {service.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {service.title}
            </h2>
            
            {/* Description */}
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="text-lg leading-relaxed">
                {service.description || 'Professional service with quality and expertise.'}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              {language === 'hi' ? 'WhatsApp पर संपर्क करें' : 'Contact on WhatsApp'}
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={handleCallClick}
              className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg font-semibold"
            >
              <Phone className="h-5 w-5 mr-2" />
              {language === 'hi' ? 'अभी कॉल करें' : 'Call Us Now'}
            </Button>
          </div>

          {/* Features Section */}
          {service.features?.length > 0 && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {language === 'hi' ? 'सेवा विशेषताएं' : 'Service Features'}
                </h3>
                <p className="text-gray-600">
                  {language === 'hi' ? 'हमारी सेवाओं में शामिल मुख्य विशेषताएं' : 'Key features included in our services'}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-md border-l-4 border-orange-600">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* Final CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              {service.cta_text || (language === 'hi' ? 'अभी शुरू करें' : 'Get Started Today')}
            </h3>
            <p className="text-orange-100 mb-6">
              {language === 'hi' 
                ? 'अपने सपनों के प्रोजेक्ट को वास्तविकता में बदलें। आज ही संपर्क करें!'
                : 'Transform your dream project into reality. Contact us today!'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'WhatsApp पर संपर्क करें' : 'Contact on WhatsApp'}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={handleCallClick}
                className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg font-semibold"
              >
                <Phone className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'अभी कॉल करें' : 'Call Us Now'}
              </Button>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 pt-8 border-t">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'hi' ? 'अभी संपर्क करें' : 'Get In Touch Today'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'hi' 
                ? 'हमारे विशेषज्ञों से बात करें और अपने प्रोजेक्ट की जानकारी पाएं।'
                : 'Speak with our experts and get information about your project.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'WhatsApp पर चैट करें' : 'Chat on WhatsApp'}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={handleCallClick}
                className="border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                <Phone className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'अभी कॉल करें' : 'Call Now'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};