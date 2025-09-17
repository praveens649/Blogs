"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateBlog } from "@/app/hooks/useCreateBlog";
import { AuthService } from "@/app/backend/auth.service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, Image, Send, ArrowLeft, Sparkles, FileText } from "lucide-react";
import Link from "next/link";

const CreateBlogPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const { mutate: createBlog, isPending, } = useCreateBlog();

  useEffect(() => {
    const checkAuth = async () => {
      const authService = new AuthService();
      const userId = await authService.getCurrentUserId();
      setIsAuthenticated(!!userId);
      setIsCheckingAuth(false);
      
      if (!userId) {
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBlog(
      { ...form, image: imageFile },
      {
        onSuccess: () => router.push("/blog"),
        onError: (error) => {
          console.error("Error creating blog:", error);
          console.error("Error details:", JSON.stringify(error, null, 2));
          console.error("Error message:", error?.message);
          console.error("Error stack:", error?.stack);
        },
      }
    );
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto"></div>
          <p className="text-lg text-muted-foreground animate-pulse">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🔐</span>
          </div>
          <p className="text-lg text-primary">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <PenTool className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Create New Blog
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">Share your thoughts with the world</p>
              </div>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="group hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Blogs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-card via-card to-card/50">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl font-bold">Write Your Story</CardTitle>
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-muted-foreground">Express your ideas and connect with readers around the globe</p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileText className="w-4 h-4" />
                  Blog Title
                </label>
                <Input
                  placeholder="Enter an engaging title for your blog..."
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  className="h-12 text-lg border-2 focus:border-primary/50 transition-all duration-300"
                />
              </div>

              {/* Content Textarea */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <PenTool className="w-4 h-4" />
                  Content
                </label>
                <Textarea
                  placeholder="Write your blog content here... Share your thoughts, experiences, and insights."
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  required
                  className="min-h-[300px] text-base border-2 focus:border-primary/50 transition-all duration-300 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Image className="w-4 h-4" />
                  Featured Image (Optional)
                </label>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="h-12 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                  />
                  {imageFile && (
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border">
                      <p className="text-sm text-primary font-medium">Selected: {imageFile.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isPending}
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group h-14 text-lg"
                >
                  {isPending ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full mr-3"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                      Publish Blog
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBlogPage;
