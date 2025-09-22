import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';
import { Menu, Phone, MessageCircle, Globe, Languages } from 'lucide-react';
import { companyInfo } from '../mock';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, changeLanguage, t } = useLanguage();
  
  // Construct full logo URL
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const logoUrl = companyInfo.logo.startsWith('http') ? companyInfo.logo : `${backendUrl}${companyInfo.logo}`;

  const navigation = [
    { name: t(translations.nav.home), href: '/' },
    { name: t(translations.nav.about), href: '/about' },
    { name: t(translations.nav.services), href: '/services' },
    { name: t(translations.nav.portfolio), href: '/portfolio' },
    { name: t(translations.nav.gallery), href: '/gallery' },
    { name: t(translations.nav.contact), href: '/contact' }
  ];

  const isActivePath = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleWhatsAppClick = () => {
    const message = language === 'hi' ? 
      'नमस्ते! मुझे SYNERGY INDIA की services के बारे में जानकारी चाहिए।' :
      'Hello! I would like to know about SYNERGY INDIA services.';
    window.open(`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={logoUrl} 
              alt="SYNERGY INDIA Logo" 
              className="h-10 w-10 lg:h-12 lg:w-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold text-gray-900">
                {t(translations.company.name)}
              </span>
              <span className="text-xs text-orange-600 font-medium">
                {t(translations.company.certification)}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item.href)
                    ? 'text-orange-600'
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                {item.name}
                {isActivePath(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-gray-600 hover:text-orange-600"
            >
              <Languages className="h-4 w-4 mr-1" />
              {language === 'en' ? 'हि' : 'EN'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = `tel:${companyInfo.phone}`}
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <Phone className="h-4 w-4 mr-2" />
              {t(translations.actions.callNow)}
            </Button>
            <Button
              size="sm"
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  {/* Language Toggle Mobile */}
                  <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-700">Language</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleLanguage}
                      className="text-orange-600"
                    >
                      <Languages className="h-4 w-4 mr-1" />
                      {language === 'en' ? 'हिंदी' : 'English'}
                    </Button>
                  </div>
                  
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 text-base font-medium transition-colors ${
                        isActivePath(item.href)
                          ? 'text-orange-600 bg-orange-50 rounded-md'
                          : 'text-gray-700 hover:text-orange-600'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => {
                        window.location.href = `tel:${companyInfo.phone}`;
                        setIsOpen(false);
                      }}
                      className="border-orange-600 text-orange-600 hover:bg-orange-50 justify-start"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {t(translations.actions.callNow)}
                    </Button>
                    <Button
                      onClick={() => {
                        handleWhatsAppClick();
                        setIsOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white justify-start"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};