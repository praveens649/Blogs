import { supabase } from "@/lib/supabaseClient";
import { AuthError,  User } from "@supabase/supabase-js";

interface SignUpData {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User | null;
  error?: string;
}

export class AuthService {
  async getCurrentUserEmail(): Promise<string | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user?.email || null;
    } catch (error) {
      console.error("Error fetching user email:", error);
      return null;
    }
  }

  async getCurrentUsername(): Promise<string | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user?.user_metadata?.username || null;
    } catch (error) {
      console.error("Error fetching username:", error);
      return null;
    }
  }


  async getCurrentUserId(): Promise<string | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user?.id || null;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      console.log(data.email);
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      console.log("Signup successful:", authData);
      return { user: authData.user };
    } catch (error) {
      console.error("Signup failed:", error);
      return { user: null, error: (error as AuthError).message };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log("Attempting login with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      console.log("Login successful:", data);
      return { user: data.user };
    } catch (error) {
      console.error("Login failed:", error);
      return { user: null, error: (error as AuthError).message };
    }
  }

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error);
      return { success: false, error: (error as AuthError).message };
    }
  }
}
