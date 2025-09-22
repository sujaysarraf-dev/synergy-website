import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Building2, 
  Wheat, 
  Sun, 
  Award, 
  CheckCircle, 
  Star, 
  ArrowRight,
  Phone,
  MessageCircle,
  Shield,
  Clock,
  Users,
  Zap,
  Building
} from 'lucide-react';
import { companyInfo, services, testimonials, portfolioItems, companyPhotos } from '../mock';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

export const Home = () => {
  const { language, t } = useLanguage();
  
  const handleWhatsAppClick = () => {
    const message = language === 'hi' ? 
      'नमस्ते! मुझे SYNERGY INDIA की services के बारे में जानकारी चाहिए।' :
      'Hello! I would like to know about SYNERGY INDIA services.';
    window.open(`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const whyChooseUs = [
    {
      icon: Shield,
      title: language === 'hi' ? "ISO 9001:2015 प्रमाणित" : "ISO 9001:2015 Certified",
      description: language === 'hi' ? "Quality assurance के साथ" : "Quality assurance guaranteed",
      color: "text-blue-600"
    },
    {
      icon: Clock,
      title: language === 'hi' ? "समय पर डिलिवरी" : "On-Time Delivery",
      description: language === 'hi' ? "समय पर काम पूरा करने की गारंटी" : "Guaranteed timely project completion",
      color: "text-green-600"
    },
    {
      icon: Users,
      title: language === 'hi' ? "विशेषज्ञ टीम" : "Expert Team",
      description: language === 'hi' ? "अनुभवी और skilled professionals" : "Experienced and skilled professionals",
      color: "text-purple-600"
    },
    {
      icon: Zap,
      title: language === 'hi' ? "सरकारी योजना सहायता" : "Govt. Scheme Support",
      description: language === 'hi' ? "सभी सरकारी योजनाओं में सहायता" : "Support for all government schemes",
      color: "text-orange-600"
    }
  ];

  const workProcess = [
    {
      step: "01",
      title: language === 'hi' ? "परामर्श" : "Consultation",
      description: language === 'hi' ? "Free consultation और requirement analysis" : "Free consultation and requirement analysis"
    },
    {
      step: "02", 
      title: language === 'hi' ? "योजना" : "Planning",
      description: language === 'hi' ? "Detailed planning और design approval" : "Detailed planning and design approval"
    },
    {
      step: "03",
      title: language === 'hi' ? "निष्पादन" : "Execution", 
      description: language === 'hi' ? "Quality execution और regular updates" : "Quality execution with regular updates"
    },
    {
      step: "04",
      title: language === 'hi' ? "सुपुर्दगी" : "Handover",
      description: language === 'hi' ? "Final inspection और warranty के साथ handover" : "Final inspection and handover with warranty"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="border-orange-600 text-orange-600">
                  <Award className="h-3 w-3 mr-1" />
                  {t(translations.company.certification)}
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="block">{t(translations.home.heroTitle)}</span>
                  <span className="block text-orange-600">{t(translations.home.heroTitleHighlight)}</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {t(translations.company.tagline)}
                </p>
                <p className="text-lg text-gray-600">
                  {t(translations.home.heroSubtitle)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleWhatsAppClick}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {t(translations.actions.freeConsultation)}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.location.href = `tel:${companyInfo.phone}`}
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {t(translations.actions.callNow)}
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">{t(translations.trust.happyClients)}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">{t(translations.trust.yearsExperience)}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600">{t(translations.trust.projectsDone)}</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src={portfolioItems[0].image} 
                  alt="Interior Design Work"
                  className="rounded-lg shadow-lg h-48 w-full object-cover"
                />
                <img 
                  src={portfolioItems[1].image} 
                  alt="Civil Work"
                  className="rounded-lg shadow-lg h-48 w-full object-cover mt-8"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-xl">
                <div className="flex items-center space-x-2">
                  <Award className="h-8 w-8 text-orange-600" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {language === 'hi' ? 'ISO प्रमाणित' : 'ISO Certified'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'hi' ? 'गुणवत्ता की गारंटी' : 'Quality Guaranteed'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {t(translations.home.servicesTitle)}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t(translations.home.servicesSubtitle)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon === 'Building2' ? Building2 : 
                                 service.icon === 'Wheat' ? Wheat : Sun;
              
              const serviceDescription = language === 'hi' ? service.descriptionHi : service.description;
              
              return (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                      <IconComponent className="h-8 w-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {service.titleEn}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {serviceDescription}
                    </p>
                    <div className="space-y-2">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-orange-600 text-orange-600 hover:bg-orange-50"
                      asChild
                    >
                      <Link to="/services">
                        {t(translations.actions.learnMore)} <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {t(translations.home.whyChooseTitle)}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t(translations.home.whyChooseSubtitle)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <IconComponent className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {t(translations.home.processTitle)}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t(translations.home.processSubtitle)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workProcess.map((process, index) => (
              <div key={index} className="relative text-center">
                <div className="mx-auto h-20 w-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-orange-600">
                    {process.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {process.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {process.description}
                </p>
                {index < workProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-10 right-0 transform translate-x-1/2">
                    <ArrowRight className="h-6 w-6 text-orange-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {t(translations.home.testimonialsTitle)}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t(translations.home.testimonialsSubtitle)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial) => {
              const testimonialText = language === 'hi' ? testimonial.textHi : testimonial.text;
              
              return (
                <Card key={testimonial.id} className="border-0 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 mb-4 leading-relaxed">
                      "{testimonialText}"
                    </blockquote>
                    <div className="border-t pt-4">
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.location} • {testimonial.service}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Company Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge className="bg-orange-600 text-white mb-4">
                  {language === 'hi' ? 'हमारे बारे में' : 'About Us'}
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {language === 'hi' ? 'SYNERGY INDIA - आपका भरोसेमंद साझीदार' : 'SYNERGY INDIA - Your Trusted Partner'}
                </h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  {language === 'hi' 
                    ? 'ISO 9001:2015 certified SYNERGY INDIA एक leading construction, agriculture और solar energy solutions provider है। हमारा office पटना के हृदय में स्थित है।'
                    : 'ISO 9001:2015 certified SYNERGY INDIA is a leading construction, agriculture and solar energy solutions provider. Our office is located in the heart of Patna.'
                  }
                </p>
                <p>
                  {language === 'hi'
                    ? '15+ वर्षों के अनुभव के साथ, हमने 1000+ projects successfully complete किए हैं। Quality, innovation और customer satisfaction हमारी मुख्य प्राथमिकताएं हैं।'
                    : 'With 15+ years of experience, we have successfully completed 1000+ projects. Quality, innovation and customer satisfaction are our main priorities.'
                  }
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">1000+</div>
                    <div className="text-sm text-gray-600">
                      {language === 'hi' ? 'पूरी की गई परियोजनाएं' : 'Projects Completed'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">500+</div>
                    <div className="text-sm text-gray-600">
                      {language === 'hi' ? 'खुश ग्राहक' : 'Happy Clients'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <Button 
                  asChild
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Link to="/about">
                    {language === 'hi' ? 'और जानें' : 'Learn More'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-xl">
                <img 
                  src={companyPhotos.officePhoto}
                  alt="SYNERGY INDIA Office"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-orange-600 text-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Building className="h-6 w-6" />
                  <div>
                    <div className="font-semibold">ISO 9001:2015</div>
                    <div className="text-xs text-orange-100">Certified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              {t(translations.home.ctaTitle)}
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              {t(translations.home.ctaSubtitle)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={handleWhatsAppClick}
                className="bg-white text-orange-600 hover:bg-gray-100 px-8"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'WhatsApp पर चर्चा करें' : 'Discuss on WhatsApp'}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.location.href = `tel:${companyInfo.phone}`}
                className="border-white text-white hover:bg-white hover:text-orange-600 px-8"
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