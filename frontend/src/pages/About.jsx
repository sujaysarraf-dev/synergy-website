import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  Award, 
  Users, 
  Target, 
  Eye, 
  CheckCircle, 
  Phone,
  MessageCircle,
  Building,
  Calendar,
  Trophy,
  Heart
} from 'lucide-react';
import { companyInfo, teamMembers, companyPhotos } from '../mock';
import { useLanguage } from '../contexts/LanguageContext';

export const About = () => {
  const { language } = useLanguage();
  
  const handleWhatsAppClick = () => {
    const message = language === 'hi' ? 
      'नमस्ते! मुझे SYNERGY INDIA के बारे में और जानकारी चाहिए।' :
      'Hello! I would like to know more about SYNERGY INDIA.';
    window.open(`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const companyStats = [
    { number: '15+', label: language === 'hi' ? 'साल का अनुभव' : 'Years Experience' },
    { number: '1000+', label: language === 'hi' ? 'पूरी की गई परियोजनाएं' : 'Projects Completed' },
    { number: '500+', label: language === 'hi' ? 'खुश ग्राहक' : 'Happy Clients' },
    { number: '50+', label: language === 'hi' ? 'टीम के सदस्य' : 'Team Members' }
  ];

  const certifications = [
    {
      title: 'ISO 9001:2015',
      description: language === 'hi' ? 'गुणवत्ता प्रबंधन प्रणाली प्रमाणन' : 'Quality Management System Certification',
      year: '2020'
    },
    {
      title: 'NSIC Registration',
      description: language === 'hi' ? 'राष्ट्रीय लघु उद्योग निगम पंजीकरण' : 'National Small Industries Corporation Registration',
      year: '2019'
    },
    {
      title: 'Government Approved',
      description: language === 'hi' ? 'सरकारी ठेकेदार लाइसेंस' : 'Government Contractor License',
      year: '2018'
    }
  ];

  const values = [
    {
      icon: Trophy,
      title: language === 'hi' ? 'गुणवत्ता' : 'Quality',
      description: language === 'hi' ? 'हर प्रोजेक्ट में सर्वोच्च गुणवत्ता मानक' : 'Highest quality standards in every project'
    },
    {
      icon: CheckCircle,
      title: language === 'hi' ? 'विश्वसनीयता' : 'Reliability',
      description: language === 'hi' ? 'समय पर डिलिवरी और पारदर्शी काम' : 'Timely delivery and transparent work'
    },
    {
      icon: Users,
      title: language === 'hi' ? 'ग्राहक संतुष्टि' : 'Customer Satisfaction',
      description: language === 'hi' ? 'ग्राहकों की जरूरतों को समझना और पूरा करना' : 'Understanding and fulfilling customer needs'
    },
    {
      icon: Heart,
      title: language === 'hi' ? 'सामाजिक जिम्मेदारी' : 'Social Responsibility',
      description: language === 'hi' ? 'समुदाय के विकास में योगदान' : 'Contributing to community development'
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
              {language === 'hi' ? 'हमारे बारे में' : 'About SYNERGY INDIA'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'hi' 
                ? 'गुणवत्ता, भरोसा और नवाचार के साथ 15 सालों से बिहार और झारखंड में सेवा प्रदान कर रहे हैं।'
                : 'Serving Bihar and Jharkhand for 15 years with quality, trust and innovation in construction, agriculture and solar energy solutions.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {language === 'hi' ? 'हमारी कहानी' : 'Our Story'}
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  {language === 'hi' 
                    ? 'SYNERGY INDIA की स्थापना 2009 में एक छोटी civil contracting company के रूप में हुई थी। आज हम बिहार और झारखंड की leading construction, agriculture और solar energy company हैं।'
                    : 'SYNERGY INDIA was established in 2009 as a small civil contracting company. Today we are a leading construction, agriculture and solar energy company in Bihar and Jharkhand.'
                  }
                </p>
                <p>
                  {language === 'hi'
                    ? 'हमारी यात्रा में हमने 1000+ projects successfully complete किए हैं। हमारा मुख्य focus हमेशा quality, customer satisfaction और timely delivery पर रहा है।'
                    : 'In our journey, we have successfully completed 1000+ projects. Our main focus has always been on quality, customer satisfaction and timely delivery.'
                  }
                </p>
                <p>
                  {language === 'hi'
                    ? '2020 में हमने ISO 9001:2015 certification प्राप्त किया और आज हम government schemes के माध्यम से किसानों और घर मालिकों को subsidized solutions प्रदान करते हैं।'
                    : 'In 2020, we achieved ISO 9001:2015 certification and today we provide subsidized solutions to farmers and homeowners through government schemes.'
                  }
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={companyPhotos.officePhoto}
                  alt="SYNERGY INDIA Office"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-orange-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">ISO 9001:2015</div>
                <div className="text-orange-100">Certified Company</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {language === 'hi' ? 'हमारा विजन' : 'Our Vision'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-center">
                  {language === 'hi'
                    ? 'बिहार और झारखंड में construction, agriculture और renewable energy के क्षेत्र में सबसे भरोसेमंद और innovative company बनना। हमारा लक्ष्य sustainable development और community empowerment के माध्यम से regional growth में योगदान देना है।'
                    : 'To become the most trusted and innovative company in construction, agriculture and renewable energy sectors in Bihar and Jharkhand. Our goal is to contribute to regional growth through sustainable development and community empowerment.'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {language === 'hi' ? 'हमारा मिशन' : 'Our Mission'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-center">
                  {language === 'hi'
                    ? 'Quality construction, modern agriculture solutions और affordable solar energy systems के माध्यम से लोगों के जीवन को बेहतर बनाना। Government schemes का proper utilization करके common people को maximum benefits प्रदान करना।'
                    : 'To improve people\'s lives through quality construction, modern agriculture solutions and affordable solar energy systems. To provide maximum benefits to common people through proper utilization of government schemes.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {language === 'hi' ? 'हमारे मूल्य' : 'Our Core Values'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'hi'
                ? 'जो सिद्धांत हमारे काम और व्यवहार को निर्देशित करते हैं'
                : 'The principles that guide our work and behavior'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <IconComponent className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge className="bg-orange-600 text-white mb-4">
                    {language === 'hi' ? 'संस्थापक और निदेशक' : 'Founder & Director'}
                  </Badge>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {language === 'hi' ? 'हमारे नेतृत्व से मिलें' : 'Meet Our Leadership'}
                  </h2>
                </div>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    {language === 'hi' 
                      ? 'SYNERGY INDIA के संस्थापक और निदेशक के रूप में, हमारा vision है कि हम quality services और innovative solutions के माध्यम से अपने clients की expectations को exceed करें।'
                      : 'As the Founder and Director of SYNERGY INDIA, our vision is to exceed our clients\' expectations through quality services and innovative solutions.'
                    }
                  </p>
                  <p>
                    {language === 'hi'
                      ? '15+ वर्षों के अनुभव के साथ, हमने construction, agriculture और solar energy sectors में excellence का एक standard establish किया है।'
                      : 'With 15+ years of experience, we have established a standard of excellence in construction, agriculture and solar energy sectors.'
                    }
                  </p>
                  <p>
                    {language === 'hi'
                      ? 'हमारी commitment sustainable development और customer satisfaction के लिए हमेशा हमारी priority रही है।'
                      : 'Our commitment to sustainable development and customer satisfaction has always been our priority.'
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-4 pt-4">
                  <Button 
                    onClick={handleWhatsAppClick}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {language === 'hi' ? 'संपर्क करें' : 'Get In Touch'}
                  </Button>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src={companyPhotos.ownerPhoto}
                    alt="SYNERGY INDIA Founder and Director"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Award className="h-6 w-6 text-orange-600" />
                    <div>
                      <div className="font-semibold text-gray-900">15+ Years</div>
                      <div className="text-sm text-gray-600">
                        {language === 'hi' ? 'अनुभव' : 'Experience'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {language === 'hi' ? 'हमारी टीम' : 'Our Expert Team'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'hi'
                ? 'अनुभवी professionals जो आपके projects को successful बनाते हैं'
                : 'Experienced professionals who make your projects successful'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="border-0 shadow-lg group hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-orange-600 font-medium">
                    {language === 'hi' ? member.position : member.positionEn}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    {language === 'hi' ? member.experience : member.experienceEn}
                  </p>
                  <p className="text-sm text-gray-700">
                    {language === 'hi' ? member.description : member.descriptionHi}
                  </p>
                  <div className="pt-2">
                    <Badge variant="outline" className="text-xs">
                      {language === 'hi' ? member.specialization : member.specializationEn}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {language === 'hi' ? 'प्रमाणन और मान्यता' : 'Certifications & Recognition'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'hi'
                ? 'Quality और reliability के लिए मिली हुई मान्यताएं'
                : 'Recognition received for quality and reliability'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader>
                  <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {cert.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {cert.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-orange-600">
                    {language === 'hi' ? `प्राप्त: ${cert.year}` : `Achieved: ${cert.year}`}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              {language === 'hi' 
                ? 'हमारे साथ जुड़ें और सफलता की नई कहानी लिखें'
                : 'Join us and write a new story of success'
              }
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              {language === 'hi'
                ? 'आपके सपनों को साकार करने के लिए हमारी expert team तैयार है'
                : 'Our expert team is ready to make your dreams come true'
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
                {language === 'hi' ? 'WhatsApp पर बात करें' : 'Chat on WhatsApp'}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.location.href = `tel:${companyInfo.phone}`}
                className="border-white text-white hover:bg-white hover:text-orange-600 px-8"
              >
                <Phone className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'कॉल करें' : 'Call Now'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};