
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  email_confirmed_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailConfirmed: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check active session and set the user when the component mounts
    const initSession = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
          name: data.session.user.email?.split('@')[0] || '',
          email_confirmed_at: data.session.user.email_confirmed_at
        });
      }
      
      setIsLoading(false);
    };

    initSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.email?.split('@')[0] || '',
            email_confirmed_at: session.user.email_confirmed_at
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'USER_UPDATED') {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || '',
              email_confirmed_at: session.user.email_confirmed_at
            });
          }
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      if (data.user) {
        if (!data.user.email_confirmed_at) {
          toast({
            title: "Email not confirmed",
            description: "Please check your email and confirm your account before logging in.",
            variant: "destructive"
          });
          await supabase.auth.signOut();
          setUser(null);
          throw new Error("Email not confirmed");
        }
        
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.email?.split('@')[0] || '',
          email_confirmed_at: data.user.email_confirmed_at
        });
        
        toast({
          title: "Login successful",
          description: "Welcome back!"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      if (data.user) {
        // Don't automatically set the user - they need to confirm their email first
        toast({
          title: "Registration successful",
          description: "Please check your email to confirm your account before logging in.",
        });
        
        // Sign out immediately since we require email confirmation
        await supabase.auth.signOut();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailConfirmed = !!user?.email_confirmed_at;

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user && isEmailConfirmed,
    isLoading,
    isEmailConfirmed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
