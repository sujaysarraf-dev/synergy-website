import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { 
  Award,
  Phone,
  MessageCircle,
  Eye,
  X,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { companyInfo } from '../mock';

export const Gallery = () => {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gallery images from backend
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/gallery`);
        
        if (response.ok) {
          const imagesData = await response.json();
          // Filter only active images, sort by order, and construct full image URLs
          const activeImages = imagesData
            .filter(image => image.is_active)
            .sort((a, b) => a.order - b.order)
            .map(image => ({
              ...image,
              url: image.url.startsWith('http') ? image.url : `${backendUrl}${image.url}`
            }));
          setGalleryImages(activeImages);
        } else {
          throw new Error('Failed to fetch gallery images');
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        setError('Failed to load gallery images');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);
  
  const handleWhatsAppClick = () => {
    const message = language === 'hi' ? 
      'नमस्ते! मुझे आपके projects के बारे में जानकारी चाहिए।' :
      'Hello! I would like to know about your projects.';
    window.open(`https://wa.me/918404861022?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = 'tel:+918404861022';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading gallery...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const pageContent = {
    title: language === 'hi' ? 'हमारी कार्य गैलरी' : 'Our Work Gallery',
    subtitle: language === 'hi' 
      ? 'हमारे recent projects की एक झलक देखें'
      : 'A quick look at our recent projects.'
  };

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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'WhatsApp पर संपर्क करें' : 'Contact on WhatsApp'}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleCallClick}
                className="border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                <Phone className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'कॉल करें' : 'Call Now'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <div 
                key={image.id} 
                className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-square">
                  <img 
                    src={image.url} 
                    alt={image.alt_text || image.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-bold mb-1">
                    {image.caption || image.title}
                  </h3>
                  <p className="text-sm text-gray-200 mb-2">
                    {image.category} • {image.location}
                  </p>
                </div>

                {/* Hover Icon */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="h-5 w-5 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">
                1000+
              </div>
              <div className="text-gray-600 font-medium">
                {language === 'hi' ? 'पूरी की गई परियोजनाएं' : 'Completed Projects'}
              </div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">
                500+
              </div>
              <div className="text-gray-600 font-medium">
                {language === 'hi' ? 'खुश ग्राहक' : 'Happy Clients'}
              </div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">
                15+
              </div>
              <div className="text-gray-600 font-medium">
                {language === 'hi' ? 'साल का अनुभव' : 'Years Experience'}
              </div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">
                98%
              </div>
              <div className="text-gray-600 font-medium">
                {language === 'hi' ? 'ग्राहक संतुष्टि' : 'Client Satisfaction'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Lightbox */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
            <div className="relative">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.alt_text || selectedImage.caption}
                className="w-full max-h-[80vh] object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {selectedImage.caption || selectedImage.title}
                </h3>
                <p className="text-gray-200">
                  {selectedImage.category} • {selectedImage.location}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              {language === 'hi' 
                ? 'आपका भी Project इसी तरह बनवाना चाहते हैं?'
                : 'Want Your Project to Look Like This Too?'
              }
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              {language === 'hi'
                ? 'Quality work और professional execution के साथ हम आपके सपनों को साकार करते हैं'
                : 'We bring your dreams to life with quality work and professional execution'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={handleWhatsAppClick}
                className="bg-white text-orange-600 hover:bg-gray-100 px-8"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'अपना Project Start करें' : 'Start Your Project'}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleCallClick}
                className="border-white text-white hover:bg-white hover:text-orange-600 px-8"
              >
                <Phone className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'Free Consultation' : 'Free Consultation'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};