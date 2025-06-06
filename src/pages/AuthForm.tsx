
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get redirect path from location state or default to products
  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || '/products';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      // Error handling is done in the login function
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await register(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Registration error:', error);
      // Error handling is done in the register function
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            {isRegisterMode ? 'Register' : 'Login'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isRegisterMode ? 'Create a new account' : 'Sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="a90685766@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-gray-100 border-0 text-gray-900 placeholder:text-gray-500"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-gray-100 border-0 text-gray-900"
                required
                disabled={isLoading}
              />
            </div>
            
            {isRegisterMode && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 bg-gray-100 border-0 text-gray-900"
                  required
                  disabled={isLoading}
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRegisterMode ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (
                isRegisterMode ? 'Register' : 'Login'
              )}
            </Button>
          </form>
          
          <div className="text-center">
            <span className="text-sm text-gray-600">
              {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                disabled={isLoading}
              >
                {isRegisterMode ? 'Login' : 'Register'}
              </button>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
