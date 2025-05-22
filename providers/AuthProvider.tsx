import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  is_admin: boolean;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Helper functions for AsyncStorage
const persistSession = async (session: Session | null) => {
  try {
    if (session) {
      await AsyncStorage.setItem('supabase.auth.session', JSON.stringify(session));
    } else {
      await AsyncStorage.removeItem('supabase.auth.session');
    }
  } catch (error) {
    console.error('Error persisting session:', error);
  }
};

const getPersistedSession = async (): Promise<Session | null> => {
  try {
    const sessionStr = await AsyncStorage.getItem('supabase.auth.session');
    return sessionStr ? JSON.parse(sessionStr) : null;
  } catch (error) {
    console.error('Error getting persisted session:', error);
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Immediately try to restore session from AsyncStorage while waiting for Supabase
  useEffect(() => {
    const restoreSession = async () => {
      const persistedSession = await getPersistedSession();
      if (persistedSession) {
        setSession(persistedSession);
        setUser(persistedSession.user);
      }
    };
    restoreSession();
  }, []);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  // Main auth effect
  useEffect(() => {
    let mounted = true;

    const fetchSessionAndProfile = async () => {
      try {
        // First check if we have a persisted session
        const persistedSession = await getPersistedSession();
        if (persistedSession) {
          // Verify the persisted session is still valid
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (!mounted) return;
          
          if (error) throw error;

          // If the persisted session matches the current session, use it
          if (session && persistedSession.access_token === session.access_token) {
            console.log('Using valid persisted session');
            setSession(session);
            setUser(session.user);
            await persistSession(session);
            await fetchProfile(session.user.id);
            return;
          }
        }

        // If no valid persisted session, get fresh session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) throw error;

        console.log('Initial session:', session);
        setSession(session);
        setUser(session?.user ?? null);
        await persistSession(session);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setSession(null);
        setUser(null);
        setProfile(null);
        await persistSession(null);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    };

    fetchSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        await persistSession(session);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Refresh session and profile
  const refreshSession = async () => {
    try {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      setSession(session);
      setUser(session?.user ?? null);
      await persistSession(session);

      if (session?.user) {
        await fetchProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setSession(null);
      setUser(null);
      setProfile(null);
      await persistSession(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        await persistSession(data.session);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        await supabase
          .from('users')
          .insert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            avatar_url: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
            is_admin: false
          });

        if (data.session) {
          await persistSession(data.session);
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      await persistSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      setLoading(true);
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      await fetchProfile(user.id);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserWithProfile = () => {
    if (!user) return null;
    
    return {
      ...user,
      displayName: profile ? `${profile.first_name} ${profile.last_name}` : 'Guest',
      photoURL: profile?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`,
      is_admin: profile?.is_admin || false
    };
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user: getUserWithProfile(), 
        session,
        profile,
        loading: loading || initialLoad,
        login, 
        signup, 
        logout, 
        updateProfile,
        refreshSession
      }}
    >
      {!initialLoad && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);