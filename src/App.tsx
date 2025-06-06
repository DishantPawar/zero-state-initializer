
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import AuthForm from "./pages/AuthForm";
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import ProductDetails from "./pages/ProductDetails";
import IngredientList from "./pages/IngredientList";
import IngredientForm from "./pages/IngredientForm";
import IngredientDetails from "./pages/IngredientDetails";
import ProductImport from "./pages/ProductImport";
import IngredientImport from "./pages/IngredientImport";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Protected Route wrapper with loading state
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the location they tried to access for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Public Route wrapper (redirect to products if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If they're authenticated, redirect them to where they were trying to go
  // or to the default products page
  if (isAuthenticated) {
    const destination = location.state?.from?.pathname || "/products";
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <AuthForm />
          </PublicRoute>
        } 
      />
      <Route 
        path="/products" 
        element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/products/create" 
        element={
          <ProtectedRoute>
            <ProductForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/products/edit/:id" 
        element={
          <ProtectedRoute>
            <ProductForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/products/details/:id" 
        element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/products/import" 
        element={
          <ProtectedRoute>
            <ProductImport />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ingredients" 
        element={
          <ProtectedRoute>
            <IngredientList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ingredients/create" 
        element={
          <ProtectedRoute>
            <IngredientForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ingredients/edit/:id" 
        element={
          <ProtectedRoute>
            <IngredientForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ingredients/details/:id" 
        element={
          <ProtectedRoute>
            <IngredientDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ingredients/import" 
        element={
          <ProtectedRoute>
            <IngredientImport />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
