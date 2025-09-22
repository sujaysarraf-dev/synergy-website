import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Globe, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageModal = () => {
  const { showLanguageModal, changeLanguage } = useLanguage();

  return (
    <Dialog open={showLanguageModal} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Languages className="h-8 w-8 text-orange-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Choose Your Language
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Select your preferred language to continue
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <Button
            onClick={() => changeLanguage('en')}
            variant="outline"
            size="lg"
            className="w-full h-14 text-left justify-start space-x-4 border-2 hover:border-orange-600 hover:bg-orange-50"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">EN</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">English</div>
                <div className="text-sm text-gray-500">Continue in English</div>
              </div>
            </div>
          </Button>
          
          <Button
            onClick={() => changeLanguage('hi')}
            variant="outline"
            size="lg"
            className="w-full h-14 text-left justify-start space-x-4 border-2 hover:border-orange-600 hover:bg-orange-50"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-semibold text-sm">हि</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">हिंदी</div>
                <div className="text-sm text-gray-500">हिंदी में जारी रखें</div>
              </div>
            </div>
          </Button>
        </div>
        
        <div className="text-center mt-6 text-xs text-gray-500">
          You can change language anytime from the top menu
        </div>
      </DialogContent>
    </Dialog>
  );
};