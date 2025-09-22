import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft,
  Phone,
  MessageCircle,
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const ServiceDetail = () => {
  const { slug } = useParams(); // This will be the service ID
  const { language } = useLanguage();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ctaSettings, setCTASettings] = useState(null);

  // Fetch service details and CTA settings
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
        
        // Fetch service details
        const serviceResponse = await fetch(`${backendUrl}/api/services/${slug}`);
        if (serviceResponse.ok) {
          const serviceData = await serviceResponse.json();
          // Construct full image URLs
          const serviceWithFullUrls = {
            ...serviceData,
            images: serviceData.images ? serviceData.images.map(img => 
              img.startsWith('http') ? img : `${backendUrl}${img}`
            ) : []
          };
          setService(serviceWithFullUrls);
        } else {
          throw new Error('Service not found');
        }

        // Fetch CTA settings
        const ctaResponse = await fetch(`${backendUrl}/api/settings/cta`);
        if (ctaResponse.ok) {
          const ctaData = await ctaResponse.json();
          setCTASettings(ctaData);
        }

      } catch (error) {
        console.error('Error fetching service details:', error);
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [slug]);

  const handleWhatsAppClick = () => {
    const phoneNumber = ctaSettings?.whatsapp_number || '918507474141';
    const template = ctaSettings?.whatsapp_template || 'Hi, I am interested in your {service_name} service';
    const message = template.replace('{service_name}', service?.title || 'services');
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCallClick = () => {
    const phoneNumber = ctaSettings?.call_number || '+916123597570';
    window.location.href = `tel:${phoneNumber}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
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
              src={service.images && service.images.length > 0 
                ? service.images[0] 
                : 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
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
                {service.overview || 'Professional service with quality and expertise.'}
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

          {/* Additional Service Information */}
          {(service.sub_services?.length > 0 || service.benefits?.length > 0) && (
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {/* Sub Services */}
              {service.sub_services?.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {language === 'hi' ? 'सेवाओं में शामिल' : 'Services Included'}
                  </h3>
                  <ul className="space-y-2">
                    {service.sub_services.map((subService, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{subService}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {service.benefits?.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {language === 'hi' ? 'मुख्य लाभ' : 'Key Benefits'}
                  </h3>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Pricing Section - Hidden for all services */}
          {false && (
            <div className="mt-12 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {language === 'hi' ? 'पारदर्शी मूल्य निर्धारण' : 'Transparent Pricing'}
                </h3>
                <p className="text-gray-600">
                  {language === 'hi' ? 'हमारी सेवाओं के लिए प्रतिस्पर्धी और पारदर्शी मूल्य' : 'Competitive and transparent pricing for our services'}
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Basic Package */}
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'hi' ? 'बेसिक पैकेज' : 'Basic Package'}
                  </h4>
                  <div className="text-3xl font-bold text-orange-600 mb-4">
                    {service.title.includes('Renovation') ? '₹75,000' :
                     service.title.includes('Interior') ? '₹1,00,000' :
                     service.title.includes('Finishing') ? '₹40,000' : '₹80,000'}
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li>• {language === 'hi' ? 'बुनियादी सेवाएं' : 'Basic Services'}</li>
                    <li>• {language === 'hi' ? 'गुणवत्तापूर्ण सामग्री' : 'Quality Materials'}</li>
                    <li>• {language === 'hi' ? '1 साल की वारंटी' : '1 Year Warranty'}</li>
                  </ul>
                </div>

                {/* Premium Package */}
                <div className="bg-white rounded-lg p-6 shadow-md text-center border-2 border-orange-600 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      {language === 'hi' ? 'सबसे लोकप्रिय' : 'Most Popular'}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'hi' ? 'प्रीमियम पैकेज' : 'Premium Package'}
                  </h4>
                  <div className="text-3xl font-bold text-orange-600 mb-4">
                    {service.title.includes('Renovation') ? '₹2,00,000' :
                     service.title.includes('Interior') ? '₹2,50,000' :
                     service.title.includes('Finishing') ? '₹1,00,000' : '₹1,80,000'}
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li>• {language === 'hi' ? 'उन्नत सेवाएं' : 'Advanced Services'}</li>
                    <li>• {language === 'hi' ? 'प्रीमियम सामग्री' : 'Premium Materials'}</li>
                    <li>• {language === 'hi' ? '2 साल की वारंटी' : '2 Year Warranty'}</li>
                    <li>• {language === 'hi' ? 'निःशुल्क रखरखाव' : 'Free Maintenance'}</li>
                  </ul>
                </div>

                {/* Luxury Package */}
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'hi' ? 'लक्जरी पैकेज' : 'Luxury Package'}
                  </h4>
                  <div className="text-3xl font-bold text-orange-600 mb-4">
                    {service.title.includes('Renovation') ? '₹4,00,000' :
                     service.title.includes('Interior') ? '₹5,00,000' :
                     service.title.includes('Finishing') ? '₹2,00,000' : '₹3,50,000'}
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li>• {language === 'hi' ? 'लक्जरी सेवाएं' : 'Luxury Services'}</li>
                    <li>• {language === 'hi' ? 'उच्चतम गुणवत्ता' : 'Highest Quality'}</li>
                    <li>• {language === 'hi' ? '5 साल की वारंटी' : '5 Year Warranty'}</li>
                    <li>• {language === 'hi' ? 'समर्पित प्रबंधक' : 'Dedicated Manager'}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Process Section - Hidden for all services */}
          {false && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {language === 'hi' ? 'हमारी प्रक्रिया' : 'Our Process'}
                </h3>
                <p className="text-gray-600">
                  {language === 'hi' ? 'आपके प्रोजेक्ट को सफल बनाने के लिए हमारी व्यवस्थित प्रक्रिया' : 'Our systematic process to make your project successful'}
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'hi' ? 'सलाह' : 'Consultation'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'hi' ? 'निःशुल्क साइट विजिट और आवश्यकता का मूल्यांकन' : 'Free site visit and requirement assessment'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'hi' ? 'डिजाइन' : 'Design'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'hi' ? 'कस्टम डिजाइन और 3D विजुअलाइजेशन' : 'Custom design and 3D visualization'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'hi' ? 'कार्यान्वयन' : 'Execution'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'hi' ? 'पेशेवर कार्यान्वयन और गुणवत्ता नियंत्रण' : 'Professional execution and quality control'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'hi' ? 'समर्थन' : 'Support'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'hi' ? 'हैंडओवर और निरंतर सहायता' : 'Handover and ongoing support'}
                  </p>
                </div>
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