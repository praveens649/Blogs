"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthService } from "@/app/backend/auth.service";
import { Loader2, User, Mail, Lock, UserPlus, LogIn,  Shield, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner"; 

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      if (!formData.username) throw new Error("Username is required");
      if (!formData.email) throw new Error("Email is required");
      if (formData.password.length < 8)
        throw new Error("Password must be at least 8 characters");
      if (formData.password !== formData.confirmPassword)
        throw new Error("Passwords do not match");
  
      const authService = new AuthService();
      const { user } = await authService.signUp({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
  
      console.log("User signed up successfully!", user);
      toast.success("Account created successfully! Welcome to our blog platform!");
      router.push("/blog"); // Redirect to blog page after signup
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <Card className="relative w-full max-w-lg shadow-2xl border-0 bg-gradient-to-br from-card via-card to-card/50 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-lg"></div>
        
        <CardHeader className="relative text-center space-y-6 pt-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Join Our Community
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Create your account and start sharing your stories
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative space-y-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={handleChange}
                className="h-12 text-base border-2 focus:border-primary/50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="h-12 text-base border-2 focus:border-primary/50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="h-12 text-base border-2 focus:border-primary/50 transition-all duration-300"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-12 text-base border-2 focus:border-primary/50 transition-all duration-300"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Create Account
                </>
              )}
            </Button>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center font-medium">{error}</p>
              </div>
            )}
          </form>
          
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Already have an account?</span>
              <Link 
                href="/login" 
                className="font-medium text-primary hover:text-primary/80 transition-colors duration-300 flex items-center gap-1 group"
              >
                <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                Sign In
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;