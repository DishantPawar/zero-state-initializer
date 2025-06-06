
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch, Redirect, useLocation } from "wouter";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { queryClient } from "./lib/queryClient";
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

// Protected Route wrapper with loading state
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

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
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
};

// Public Route wrapper (redirect to products if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
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
  
  if (isAuthenticated) {
    return <Redirect to="/products" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/login">
        <PublicRoute>
          <AuthForm />
        </PublicRoute>
      </Route>
      <Route path="/products">
        <ProtectedRoute>
          <ProductList />
        </ProtectedRoute>
      </Route>
      <Route path="/products/create">
        <ProtectedRoute>
          <ProductForm />
        </ProtectedRoute>
      </Route>
      <Route path="/products/edit/:id">
        <ProtectedRoute>
          <ProductForm />
        </ProtectedRoute>
      </Route>
      <Route path="/products/details/:id">
        <ProtectedRoute>
          <ProductDetails />
        </ProtectedRoute>
      </Route>
      <Route path="/products/import">
        <ProtectedRoute>
          <ProductImport />
        </ProtectedRoute>
      </Route>
      <Route path="/ingredients">
        <ProtectedRoute>
          <IngredientList />
        </ProtectedRoute>
      </Route>
      <Route path="/ingredients/create">
        <ProtectedRoute>
          <IngredientForm />
        </ProtectedRoute>
      </Route>
      <Route path="/ingredients/edit/:id">
        <ProtectedRoute>
          <IngredientForm />
        </ProtectedRoute>
      </Route>
      <Route path="/ingredients/details/:id">
        <ProtectedRoute>
          <IngredientDetails />
        </ProtectedRoute>
      </Route>
      <Route path="/ingredients/import">
        <ProtectedRoute>
          <IngredientImport />
        </ProtectedRoute>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
