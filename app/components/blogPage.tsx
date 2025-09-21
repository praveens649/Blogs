"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  Edit3,
  Eye,
  Plus,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthService } from "../backend/auth.service";
import { Blog, BlogService } from "../backend/blog.service";
import LogoutButton from "./logout-form";

const BlogPage = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const authService = new AuthService();
      const userId = await authService.getCurrentUserId();

      if (!userId) {
        router.replace("/login");
        return;
      }

      setCurrentUserId(userId);
    };

    getCurrentUser();
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      // Your existing auth check logic...
    };

    checkAuth();
  }, [router, supabase]);

  const {
    data: blogs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: BlogService.getBlogs,
  });

  const deleteMutation = useMutation({
    mutationFn: BlogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteMutation.mutate(id);
        await refetch();
        toast.success("Blog deleted successfully");
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast.error("Failed to delete blog");
      }
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto"></div>
          <p className="text-lg text-muted-foreground animate-pulse">
            Loading amazing blogs...
          </p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-lg text-destructive">Error loading blogs</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                    Blogspace
                  </h1>
                  <p className="text-muted-foreground mt-2 text-lg">
                    Discover amazing stories and insights
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/create">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Create New Blog
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {blogs?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {blogs.map((blog: Blog, index: number) => (
              <Card
                key={blog.id}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card via-card to-card/50 hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {blog.image_url && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={blog.image_url}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                )}

                <CardHeader className="relative z-10 space-y-3">
                  <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {blog.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{blog.author_username || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(blog.created_at || "").toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4 ">
                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                    {blog.content.slice(0, 150)}...
                  </p>

                  <div className="flex flex-col gap-2 mt-4 align-bottom justify-end">
                    <div className="grid grid-cols-1 gap-2">
                      <Link href={`/view/${blog.id}`}>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full group/btn hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                        >
                          <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                          Read More
                        </Button>
                      </Link>
                    </div>

                    {currentUserId && blog.user_id === currentUserId && (
                      <div className="grid grid-cols-2 gap-2">
                        <Link href={`/edit/${blog.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                          onClick={() => handleDelete(blog.id || "undefined")}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-6">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-muted-foreground">
                No blogs yet
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Be the first to share your thoughts and create an amazing blog
                post!
              </p>
            </div>
            <Link href="/create">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Blog
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
