'use client';

import { useQuery } from "@tanstack/react-query";
import { BlogService } from "../backend/blog.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, BookOpen, Share2, Heart, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  content: string;
  author_username: string;
  status: string;
  created_at: string;
  image_url?: string; // Updated key for Supabase image
  tags?: string[];
}
const ViewBlog = ({ blogId }: { blogId: string }) => {
  const { data: blog, isLoading, error } = useQuery<Blog>({
    queryKey: ["blog", blogId],
    queryFn: () => BlogService.getBlogById(blogId),
  });

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(42); // Mock data

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto"></div>
          <p className="text-lg text-muted-foreground animate-pulse">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-destructive">Error loading blog</h2>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Hero Section with Featured Image */}
      <div className="relative overflow-hidden">
        {blog.image_url ? (
          <div className="relative w-full h-[60vh] bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
            <Image
              src={blog.image_url}
              alt={blog.title}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-4xl mx-auto">
                <Link href="/blog">
                  <Button variant="secondary" className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blogs
                  </Button>
                </Link>
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {blog.title}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="relative max-w-4xl mx-auto px-6 py-16">
              <Link href="/blog">
                <Button variant="outline" className="mb-6 group hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  Back to Blogs
                </Button>
              </Link>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
                {blog.title}
              </h1>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Meta */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/50 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{blog.author_username || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(blog.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2 ">
                  <Clock className="w-4 h-4" />
                  <span>{Math.ceil(blog.content.split(' ').length / 200)} min read</span>
                </div>
              </div>
              
              {/* Engagement Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`group transition-all duration-300 ${isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
                >
                  <Heart className={`w-4 h-4 mr-2 transition-all duration-300 ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
                  {likes}
                </Button>
                <Button variant="ghost" size="sm" className="group hover:text-blue-500 transition-all duration-300">
                  <MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  12
                </Button>
                <Button variant="ghost" size="sm" className="group hover:text-green-500 transition-all duration-300">
                  <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Article Content */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/50">
          <CardContent className="p-8">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              <div className="text-lg leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            </article>
          </CardContent>
        </Card>

        {/* Tags Section */}
        {blog.tags && blog.tags.length > 0 && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/50 mt-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-sm rounded-full hover:bg-primary/20 transition-colors duration-300 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back to Blogs CTA */}
        <div className="text-center mt-12">
          <Link href="/blog">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <BookOpen className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Explore More Blogs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;
