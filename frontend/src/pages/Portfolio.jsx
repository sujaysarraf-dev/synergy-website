import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  DollarSign,
  Clock,
  User,
  Award,
  Eye,
  MessageCircle,
  Phone,
  ArrowRight,
  Target,
  TrendingUp
} from 'lucide-react';
import { companyInfo, portfolioItems } from '../mock';
import { useLanguage } from '../contexts/LanguageContext';

export const Portfolio = () => {
  const { language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const handleWhatsAppClick = (projectType = '') => {
    const projectText = projectType ? ` for ${projectType}` : '';
    const message = language === 'hi' ? 
      `नमस्ते! मुझे ${projectType || 'आपके projects'} जैसा काम करवाना है।` :
      `Hello! I want to get ${projectType || 'similar work'} done${projectText}.`;
    window.open(`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const categories = [
    { id: 'all', name: language === 'hi' ? 'सभी प्रोजेक्ट्स' : 'All Projects' },
    { id: 'Interior Design', name: language === 'hi' ? 'इंटीरियर डिज़ाइन' : 'Interior Design' },
    { id: 'Solar Energy', name: language === 'hi' ? 'सोलर एनर्जी' : 'Solar Energy' },
    { id: 'Agriculture', name: language === 'hi' ? 'कृषि समाधान' : 'Agriculture' }
  ];

  const filteredProjects = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  const pageContent = {
    title: language === 'hi' ? 'हमारे प्रोजेक्ट्स' : 'Our Portfolio',
    subtitle: language === 'hi' 
      ? 'Successfully completed projects showcasing our expertise and commitment to quality'
      : 'Successfully completed projects showcasing our expertise and commitment to quality',
    viewProject: language === 'hi' ? 'प्रोजेक्ट देखें' : 'View Project',
    projectDetails: language === 'hi' ? 'प्रोजेक्ट विवरण' : 'Project Details',
    getSimilarWork: language === 'hi' ? 'ऐसा काम करवाएं' : 'Get Similar Work'
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
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">1000+</div>
                <div className="text-sm text-gray-600">
                  {language === 'hi' ? 'पूरी की गई परियोजनाएं' : 'Completed Projects'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">500+</div>
                <div className="text-sm text-gray-600">
                  {language === 'hi' ? 'खुश ग्राहक' : 'Happy Clients'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">15+</div>
                <div className="text-sm text-gray-600">
                  {language === 'hi' ? 'साल का अनुभव' : 'Years Experience'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-gray-600">
                  {language === 'hi' ? 'ग्राहक संतुष्टि' : 'Client Satisfaction'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filter === category.id ? "default" : "outline"}
                onClick={() => setFilter(category.id)}
                className={filter === category.id ? "bg-orange-600 hover:bg-orange-700" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-orange-600">
                      {project.category}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {pageContent.viewProject}
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-orange-600 font-medium">
                        {project.category}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{project.year}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{project.projectValue}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{project.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedProject(project)}
                    >
                      {pageContent.projectDetails}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleWhatsAppClick(project.category)}
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {selectedProject.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'hi' ? 'प्रोजेक्ट जानकारी' : 'Project Information'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm"><strong>{language === 'hi' ? 'ग्राहक:' : 'Client:'}</strong> {selectedProject.client}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm"><strong>{language === 'hi' ? 'स्थान:' : 'Location:'}</strong> {selectedProject.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm"><strong>{language === 'hi' ? 'साल:' : 'Year:'}</strong> {selectedProject.year}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm"><strong>{language === 'hi' ? 'प्रोजेक्ट वैल्यू:' : 'Project Value:'}</strong> {selectedProject.projectValue}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm"><strong>{language === 'hi' ? 'अवधि:' : 'Duration:'}</strong> {selectedProject.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'hi' ? 'प्रोजेक्ट विवरण' : 'Project Details'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedProject.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Target className="h-4 w-4 text-orange-600 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {language === 'hi' ? 'चुनौती:' : 'Challenge:'}
                        </div>
                        <div className="text-sm text-gray-600">{selectedProject.challenge}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Award className="h-4 w-4 text-blue-600 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {language === 'hi' ? 'समाधान:' : 'Solution:'}
                        </div>
                        <div className="text-sm text-gray-600">{selectedProject.solution}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {language === 'hi' ? 'परिणाम:' : 'Result:'}
                        </div>
                        <div className="text-sm text-gray-600">{selectedProject.result}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button 
                  className="flex-1"
                  onClick={() => handleWhatsAppClick(selectedProject.category)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {pageContent.getSimilarWork}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = `tel:${companyInfo.phone}`}
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {language === 'hi' ? 'कॉल करें' : 'Call Now'}
                </Button>
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
                ? 'आपका भी Project इसी तरह Successful बनाएं'
                : 'Make Your Project Successful Too'
              }
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              {language === 'hi'
                ? 'हमारे experienced team के साथ quality और timely delivery की guarantee'
                : 'Guaranteed quality and timely delivery with our experienced team'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => handleWhatsAppClick()}
                className="bg-white text-orange-600 hover:bg-gray-100 px-8"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'अपना Project Start करें' : 'Start Your Project'}
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