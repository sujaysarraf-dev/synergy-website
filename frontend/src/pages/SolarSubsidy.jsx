import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Separator } from '../components/ui/separator';
import { 
  Sun, 
  Award, 
  CheckCircle, 
  DollarSign,
  FileText,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  Zap,
  Home,
  Calculator,
  Shield,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';
import { companyInfo, solarSchemeInfo } from '../mock';
import { useLanguage } from '../contexts/LanguageContext';

export const SolarSubsidy = () => {
  const { language } = useLanguage();
  const [calculatorData, setCalculatorData] = useState({
    roofArea: '',
    monthlyBill: '',
    systemSize: 0,
    estimatedSubsidy: 0,
    estimatedSavings: 0
  });
  
  const handleWhatsAppClick = () => {
    const message = language === 'hi' ? 
      'नमस्ते! मुझे PM Surya Ghar Yojana के बारे में जानकारी चाहिए और solar installation करवाना है।' :
      'Hello! I want to know about PM Surya Ghar Yojana and get solar installation done.';
    window.open(`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const calculateSubsidy = () => {
    const area = parseFloat(calculatorData.roofArea);
    const bill = parseFloat(calculatorData.monthlyBill);
    
    if (area && bill) {
      // Basic calculation logic
      const systemSize = Math.min(Math.floor(area / 100), Math.floor(bill / 15));
      let subsidy = 0;
      
      if (systemSize >= 1) subsidy += 30000;
      if (systemSize >= 2) subsidy += 30000;
      if (systemSize >= 3) subsidy += 18000;
      
      const annualSavings = bill * 12 * 0.8; // 80% bill reduction
      
      setCalculatorData(prev => ({
        ...prev,
        systemSize,
        estimatedSubsidy: subsidy,
        estimatedSavings: annualSavings
      }));
    }
  };

  const pageContent = {
    title: language === 'hi' ? 'PM सूर्य घर मुफ्त बिजली योजना' : 'PM Surya Ghar Free Electricity Scheme',
    subtitle: language === 'hi' 
      ? 'सरकारी सब्सिडी के साथ solar rooftop system लगाएं और free electricity पाएं'
      : 'Install solar rooftop system with government subsidy and get free electricity',
    calculator: language === 'hi' ? 'सब्सिडी कैलकुलेटर' : 'Subsidy Calculator',
    applyNow: language === 'hi' ? 'अभी Apply करें' : 'Apply Now'
  };

  const schemeHighlights = [
    {
      icon: DollarSign,
      title: language === 'hi' ? 'उच्च सब्सिडी' : 'High Subsidy',
      description: language === 'hi' ? 'Up to ₹78,000 तक सब्सिडी' : 'Up to ₹78,000 subsidy available',
      color: 'text-green-600'
    },
    {
      icon: Zap,
      title: language === 'hi' ? 'Free Electricity' : 'Free Electricity',
      description: language === 'hi' ? '300 units तक मुफ्त बिजली' : 'Up to 300 units free electricity',
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      title: language === 'hi' ? 'Long Term Benefits' : 'Long Term Benefits',
      description: language === 'hi' ? '20-25 साल तक फायदा' : '20-25 years of benefits',
      color: 'text-orange-600'
    },
    {
      icon: Shield,
      title: language === 'hi' ? 'Guaranteed Support' : 'Guaranteed Support',
      description: language === 'hi' ? 'Complete documentation help' : 'Complete documentation help',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="border-orange-600 text-orange-600 mb-4">
              <Sun className="h-3 w-3 mr-1" />
              Government Scheme
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {pageContent.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {pageContent.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {pageContent.applyNow}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.open(solarSchemeInfo.officialLink, '_blank')}
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'Official Website' : 'Official Website'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Scheme Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {schemeHighlights.map((highlight, index) => {
              const IconComponent = highlight.icon;
              return (
                <Card key={index} className="border-0 shadow-lg text-center">
                  <CardHeader className="pb-4">
                    <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className={`h-8 w-8 ${highlight.color}`} />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {highlight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits & Subsidy Details */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Benefits */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {language === 'hi' ? 'योजना के फायदे' : 'Scheme Benefits'}
                </h2>
                <div className="space-y-4">
                  {solarSchemeInfo.benefits.map((benefit, index) => {
                    const benefitText = language === 'hi' ? benefit.hi : benefit.en;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">{benefitText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-orange-600" />
                    {language === 'hi' ? 'सब्सिडी कैलकुलेशन' : 'Subsidy Calculation'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>1 KW System:</span>
                      <span className="font-semibold text-green-600">₹30,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2 KW System:</span>
                      <span className="font-semibold text-green-600">₹60,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3 KW या ज्यादा:</span>
                      <span className="font-semibold text-green-600">₹78,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calculator */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Calculator className="h-6 w-6 mr-2 text-orange-600" />
                  {pageContent.calculator}
                </CardTitle>
                <CardDescription>
                  {language === 'hi' 
                    ? 'अपने घर के लिए सब्सिडी और savings calculate करें'
                    : 'Calculate subsidy and savings for your home'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'hi' ? 'छत का क्षेत्रफल (Sq Ft)' : 'Roof Area (Sq Ft)'}
                    </label>
                    <input
                      type="number"
                      value={calculatorData.roofArea}
                      onChange={(e) => setCalculatorData(prev => ({ ...prev, roofArea: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'hi' ? 'मासिक बिजली बिल (₹)' : 'Monthly Electricity Bill (₹)'}
                    </label>
                    <input
                      type="number"
                      value={calculatorData.monthlyBill}
                      onChange={(e) => setCalculatorData(prev => ({ ...prev, monthlyBill: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="3000"
                    />
                  </div>
                </div>

                <Button 
                  onClick={calculateSubsidy}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {language === 'hi' ? 'Calculate करें' : 'Calculate'}
                </Button>

                {calculatorData.systemSize > 0 && (
                  <div className="bg-orange-50 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      {language === 'hi' ? 'आपके लिए Recommendation:' : 'Recommendation for You:'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{language === 'hi' ? 'System Size:' : 'System Size:'}</span>
                        <span className="font-semibold">{calculatorData.systemSize} KW</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'hi' ? 'Estimated Subsidy:' : 'Estimated Subsidy:'}</span>
                        <span className="font-semibold text-green-600">₹{calculatorData.estimatedSubsidy.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'hi' ? 'Annual Savings:' : 'Annual Savings:'}</span>
                        <span className="font-semibold text-blue-600">₹{calculatorData.estimatedSavings.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={handleWhatsAppClick}
                      className="w-full bg-green-600 hover:bg-green-700 mt-3"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {language === 'hi' ? 'WhatsApp पर Details पाएं' : 'Get Details on WhatsApp'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process & Documentation */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {language === 'hi' ? 'SYNERGY INDIA के साथ Process' : 'Process with SYNERGY INDIA'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'hi'
                ? 'हम पूरी process में आपकी मदद करते हैं'
                : 'We help you throughout the entire process'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Process Steps */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">
                {language === 'hi' ? 'हमारी Process' : 'Our Process'}
              </h3>
              <div className="space-y-6">
                {solarSchemeInfo.process.map((step, index) => {
                  const stepText = language === 'hi' ? step.hi : step.en;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="pt-2">
                        <p className="text-gray-700 leading-relaxed">{stepText}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-8">
              
              {/* Eligibility */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    {language === 'hi' ? 'पात्रता की शर्तें' : 'Eligibility Criteria'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {solarSchemeInfo.eligibility.map((criteria, index) => {
                      const criteriaText = language === 'hi' ? criteria.hi : criteria.en;
                      return (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{criteriaText}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-orange-600" />
                    {language === 'hi' ? 'आवश्यक दस्तावेज' : 'Required Documents'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {solarSchemeInfo.documents.map((doc, index) => {
                      const docText = language === 'hi' ? doc.hi : doc.en;
                      return (
                        <div key={index} className="flex items-start space-x-2">
                          <FileText className="h-4 w-4 text-orange-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{docText}</span>
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

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {language === 'hi' ? 'Solar Subsidy के बारे में सवाल' : 'Solar Subsidy FAQ'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'hi' 
                ? 'आपके मन में आने वाले सवालों के जवाब'
                : 'Answers to your questions about solar subsidy'
              }
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: language === 'hi' ? 'PM Surya Ghar Yojana क्या है?' : 'What is PM Surya Ghar Yojana?',
                answer: language === 'hi' 
                  ? 'यह भारत सरकार की योजना है जिसके तहत घरों में solar rooftop system लगाने पर subsidy मिलती है और free electricity मिलती है।'
                  : 'This is a Government of India scheme under which subsidy is provided for installing solar rooftop systems in homes and free electricity is provided.'
              },
              {
                question: language === 'hi' ? 'कितनी subsidy मिल सकती है?' : 'How much subsidy can I get?',
                answer: language === 'hi'
                  ? '1 KW पर ₹30,000, 2 KW पर ₹60,000 और 3 KW या अधिक पर ₹78,000 तक subsidy मिल सकती है।'
                  : 'You can get subsidy of ₹30,000 for 1 KW, ₹60,000 for 2 KW and up to ₹78,000 for 3 KW or more.'
              },
              {
                question: language === 'hi' ? 'SYNERGY INDIA कैसे help करता है?' : 'How does SYNERGY INDIA help?',
                answer: language === 'hi'
                  ? 'हम site survey से लेकर subsidy application, installation और commissioning तक का पूरा काम करते हैं। Documentation में भी complete help करते हैं।'
                  : 'We handle everything from site survey to subsidy application, installation and commissioning. We also provide complete help with documentation.'
              },
              {
                question: language === 'hi' ? 'कितने दिन में installation हो जाता है?' : 'How many days does installation take?',
                answer: language === 'hi'
                  ? 'Subsidy approval के बाद 5-15 दिन में installation complete हो जाता है। Approval process में 15-30 दिन लग सकते हैं।'
                  : 'Installation is completed in 5-15 days after subsidy approval. The approval process may take 15-30 days.'
              }
            ].map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg border shadow-sm"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 hover:text-orange-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-yellow-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              {language === 'hi' 
                ? 'आज ही Solar लगाएं और बिजली बिल से छुटकारा पाएं!'
                : 'Install Solar Today and Get Rid of Electricity Bills!'
              }
            </h2>
            <p className="text-xl text-yellow-100 max-w-2xl mx-auto">
              {language === 'hi'
                ? 'Free site survey, complete documentation help और guaranteed subsidy approval के साथ'
                : 'With free site survey, complete documentation help and guaranteed subsidy approval'
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
                {language === 'hi' ? 'WhatsApp पर Apply करें' : 'Apply on WhatsApp'}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.location.href = `tel:${companyInfo.phone}`}
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