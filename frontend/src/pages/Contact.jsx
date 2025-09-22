import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  Send,
  Award,
  Building,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { companyInfo, services } from '../mock';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

export const Contact = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
    projectType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleWhatsAppClick = () => {
    const message = language === 'hi' ? 
      'नमस्ते! मुझे SYNERGY INDIA की services के बारे में जानकारी चाहिए।' :
      'Hello! I would like to know about SYNERGY INDIA services.';
    window.open(`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get backend URL from environment
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      
      // Prepare data for backend
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        service_interested: formData.service,
        project_type: formData.projectType || "General",
        message: formData.message
      };
      
      // Submit to backend
      const response = await fetch(`${backendUrl}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
      });
      
      if (response.ok) {
        toast.success(
          language === 'hi' 
            ? 'आपका संदेश भेज दिया गया है! हम जल्द ही आपसे संपर्क करेंगे।'
            : 'Your message has been sent! We will contact you soon.'
        );
        setFormData({
          name: '',
          phone: '',
          email: '',
          service: '',
          message: '',
          projectType: ''
        });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(
        language === 'hi' 
          ? 'कुछ गलत हुआ है। कृपया दोबारा कोशिश करें या WhatsApp पर संपर्क करें।'
          : 'Something went wrong. Please try again or contact us via WhatsApp.'
      );
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pageContent = {
    title: language === 'hi' ? 'संपर्क करें' : 'Contact Us',
    subtitle: language === 'hi' 
      ? 'हमसे जुड़ें और अपने सपनों का project शुरू करें'
      : 'Get in touch with us and start your dream project',
    officeInfo: language === 'hi' ? 'ऑफिस जानकारी' : 'Office Information',
    getInTouch: language === 'hi' ? 'संपर्क फॉर्म' : 'Get In Touch',
    quickContact: language === 'hi' ? 'त्वरित संपर्क' : 'Quick Contact'
  };

  const contactMethods = [
    {
      icon: Phone,
      title: language === 'hi' ? 'फोन कॉल' : 'Phone Call',
      value: companyInfo.phone,
      description: language === 'hi' ? 'तुरंत बात करने के लिए' : 'For immediate discussion',
      action: () => window.location.href = `tel:${companyInfo.phone}`,
      color: 'text-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: companyInfo.phone,
      description: language === 'hi' ? 'तुरंत मैसेज के लिए' : 'For instant messaging',
      action: handleWhatsAppClick,
      color: 'text-green-600'
    },
    {
      icon: Mail,
      title: 'Email',
      value: companyInfo.email,
      description: language === 'hi' ? 'विस्तृत जानकारी के लिए' : 'For detailed information',
      action: () => window.location.href = `mailto:${companyInfo.email}`,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-blue-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="border-orange-600 text-orange-600 mb-4">
              <Award className="h-3 w-3 mr-1" />
              {companyInfo.certification}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              {pageContent.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {pageContent.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              {pageContent.quickContact}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'hi' 
                ? 'किसी भी तरीके से हमसे जुड़ें'
                : 'Connect with us through any method'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={method.action}>
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 transition-colors group-hover:bg-orange-100`}>
                      <IconComponent className={`h-8 w-8 ${method.color}`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {method.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {method.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                      {method.value}
                    </div>
                    <Button 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        method.action();
                      }}
                    >
                      {language === 'hi' ? 'अभी संपर्क करें' : 'Contact Now'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Info */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {pageContent.getInTouch}
                </CardTitle>
                <CardDescription>
                  {language === 'hi' 
                    ? 'अपने project के बारे में बताएं, हम आपसे जल्द संपर्क करेंगे'
                    : 'Tell us about your project, we will contact you soon'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {language === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder={language === 'hi' ? 'आपका नाम' : 'Your Name'}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {language === 'hi' ? 'फोन नंबर *' : 'Phone Number *'}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+91-XXXXXXXXXX"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {language === 'hi' ? 'ईमेल' : 'Email'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service">
                        {language === 'hi' ? 'सेवा चुनें *' : 'Select Service *'}
                      </Label>
                      <Select value={formData.service} onValueChange={(value) => handleChange('service', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'hi' ? 'सेवा चुनें' : 'Choose Service'} />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.title}>
                              {service.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectType">
                        {language === 'hi' ? 'प्रोजेक्ट टाइप' : 'Project Type'}
                      </Label>
                      <Select value={formData.projectType} onValueChange={(value) => handleChange('projectType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'hi' ? 'चुनें' : 'Select'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">{language === 'hi' ? 'आवासीय' : 'Residential'}</SelectItem>
                          <SelectItem value="commercial">{language === 'hi' ? 'व्यावसायिक' : 'Commercial'}</SelectItem>
                          <SelectItem value="industrial">{language === 'hi' ? 'औद्योगिक' : 'Industrial'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {language === 'hi' ? 'संदेश *' : 'Message *'}
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder={language === 'hi' 
                        ? 'अपने project के बारे में विस्तार से बताएं...'
                        : 'Tell us about your project in detail...'
                      }
                      rows={4}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {language === 'hi' ? 'भेजा जा रहा है...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {language === 'hi' ? 'संदेश भेजें' : 'Send Message'}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Office Information */}
            <div className="space-y-8">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <Building className="h-6 w-6 mr-2 text-orange-600" />
                    {pageContent.officeInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {language === 'hi' ? 'पता' : 'Address'}
                      </div>
                      <div className="text-gray-700 leading-relaxed">
                        {companyInfo.address}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {language === 'hi' ? 'फोन' : 'Phone'}
                      </div>
                      <div className="text-gray-700">{companyInfo.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold text-gray-900">WhatsApp</div>
                      <div className="text-gray-700">{companyInfo.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Email</div>
                      <div className="text-gray-700">{companyInfo.email}</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {language === 'hi' ? 'कार्य समय' : 'Working Hours'}
                      </div>
                      <div className="text-gray-700">
                        {language === 'hi' ? 'सोम - शनि: 9:00 AM - 7:00 PM' : 'Mon - Sat: 9:00 AM - 7:00 PM'}
                      </div>
                      <div className="text-gray-700">
                        {language === 'hi' ? 'रविवार: Emergency केवल' : 'Sunday: Emergency Only'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Features */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {language === 'hi' ? 'हमारी विशेषताएं' : 'Why Choose Us'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { icon: CheckCircle, text: language === 'hi' ? '24 घंटे में जवाब की गारंटी' : '24 Hour Response Guarantee' },
                      { icon: Award, text: language === 'hi' ? 'ISO 9001:2015 प्रमाणित कंपनी' : 'ISO 9001:2015 Certified Company' },
                      { icon: Calendar, text: language === 'hi' ? 'Free Site Visit और Consultation' : 'Free Site Visit & Consultation' },
                      { icon: MessageCircle, text: language === 'hi' ? 'WhatsApp पर तुरंत Support' : 'Instant WhatsApp Support' }
                    ].map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div key={index} className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5 text-green-600" />
                          <span className="text-gray-700">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              {language === 'hi' ? 'हमारा स्थान' : 'Our Location'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'hi' 
                ? 'पटना, बिहार में स्थित हमारा मुख्य कार्यालय'
                : 'Our main office located in Patna, Bihar'
              }
            </p>
          </div>
          
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-orange-600 mx-auto" />
              <div className="text-lg font-semibold text-gray-900">
                {language === 'hi' ? 'Google Maps एकीकरण' : 'Google Maps Integration'}
              </div>
              <div className="text-gray-600">
                {companyInfo.address}
              </div>
              <Button 
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(companyInfo.address)}`, '_blank')}
                className="mt-4"
              >
                {language === 'hi' ? 'Maps में देखें' : 'View in Maps'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};