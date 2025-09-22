import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Linkedin,
  MessageCircle,
  Award,
  Building2,
  Wheat,
  Sun
} from 'lucide-react';
import { companyInfo } from '../mock';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

export const Footer = () => {
  const { language, t } = useLanguage();
  
  // Construct full logo URL
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const logoUrl = companyInfo.logo.startsWith('http') ? companyInfo.logo : `${backendUrl}${companyInfo.logo}`;
  
  const handleWhatsAppClick = () => {
    const message = language === 'hi' ? 
      'नमस्ते! मुझे SYNERGY INDIA की services के बारे में जानकारी चाहिए।' :
      'Hello! I would like to know about SYNERGY INDIA services.';
    window.open(`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: t(translations.nav.home), href: '/' },
    { name: t(translations.nav.about), href: '/about' },
    { name: t(translations.nav.services), href: '/services' },
    { name: t(translations.nav.portfolio), href: '/portfolio' },
    { name: t(translations.nav.contact), href: '/contact' }
  ];

  const servicesInfo = [
    { 
      icon: Building2, 
      name: language === 'hi' ? "Civil & Interior Work" : "Civil & Interior Work" 
    },
    { 
      icon: Wheat, 
      name: language === 'hi' ? "Agriculture Solutions" : "Agriculture Solutions" 
    },
    { 
      icon: Sun, 
      name: language === 'hi' ? "Solar Equipment" : "Solar Equipment" 
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={logoUrl} 
                alt="SYNERGY INDIA Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">{t(translations.company.name)}</h3>
                <div className="flex items-center space-x-1 text-orange-400">
                  <Award className="h-3 w-3" />
                  <span className="text-xs">{t(translations.company.certification)}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t(translations.company.tagline)}
            </p>
            <p className="text-gray-400 text-xs">
              {t(translations.company.taglineSecondary)}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-800">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-800">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-800">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">Quick Links</h4>
            <div className="space-y-2">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="block text-gray-300 hover:text-orange-400 transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">
              {language === 'hi' ? 'हमारी सेवाएं' : 'Our Services'}
            </h4>
            <div className="space-y-3">
              {servicesInfo.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={index} className="flex items-center space-x-2 text-gray-300">
                    <IconComponent className="h-4 w-4 text-orange-400" />
                    <span className="text-sm">{service.name}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Government Scheme Link */}
            <div className="pt-2">
              <a
                href="https://www.india.gov.in/spotlight/pm-surya-ghar-muft-bijli-yojana"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                PM Surya Ghar Yojana ↗
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">
              {language === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-orange-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-300 leading-relaxed">
                  {companyInfo.address}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-400" />
                <a 
                  href={`tel:${companyInfo.phone}`}
                  className="text-sm text-gray-300 hover:text-orange-400 transition-colors"
                >
                  {companyInfo.phone}
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-400" />
                <a 
                  href={`mailto:${companyInfo.email}`}
                  className="text-sm text-gray-300 hover:text-orange-400 transition-colors"
                >
                  {companyInfo.email}
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-gray-300">
                  {language === 'hi' ? 'सोम - शनि: 9:00 AM - 7:00 PM' : 'Mon - Sat: 9:00 AM - 7:00 PM'}
                </span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <Button 
              onClick={handleWhatsAppClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
              size="sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'WhatsApp पर संपर्क करें' : 'Contact on WhatsApp'}
            </Button>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            © {currentYear} SYNERGY INDIA. All rights reserved.
          </div>
          <div className="flex space-x-4 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-orange-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-orange-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleWhatsAppClick}
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </footer>
  );
};