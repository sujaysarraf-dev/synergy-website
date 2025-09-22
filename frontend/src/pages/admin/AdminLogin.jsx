import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

export const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple frontend authentication - bypass backend check
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        // Store mock token and user info
        localStorage.setItem('adminToken', 'mock-admin-token-12345');
        localStorage.setItem('adminUser', JSON.stringify({
          name: 'Admin User',
          role: 'Admin',
          email: 'admin@synergyindia.com'
        }));
        
        toast.success('Login successful! Welcome to SYNERGY INDIA Admin Panel');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        toast.error('Invalid credentials. Please use username: admin and password: admin123');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              SYNERGY INDIA
            </CardTitle>
            <CardDescription className="text-gray-600">
              Admin Panel Access
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800 text-sm">
              <strong>Admin Credentials:</strong><br />
              Username: admin<br />
              Password: admin123
            </AlertDescription>
          </Alert>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter admin username"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter admin password"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                'Sign In to Admin Panel'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Secure admin access for SYNERGY INDIA management
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};