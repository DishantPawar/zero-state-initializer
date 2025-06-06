
import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2, Package } from 'lucide-react';

const Navigation: React.FC = () => {
  const { logout, user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation('/login');
  };

  if (isLoading) {
    return (
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-purple-600" />
                <span className="text-xl font-bold text-gray-900">Elable</span>
              </span>
            </div>
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
              <span className="ml-2 text-sm text-gray-700">Loading...</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/products" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">Elable</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Products
            </Link>
            <Link 
              to="/ingredients" 
              className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Ingredients
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
