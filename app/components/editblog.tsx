'use client';

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Blog, BlogService } from "../backend/blog.service";
import { AuthService } from "../backend/auth.service";
import { Edit3, Image, Save, ArrowLeft, Sparkles, FileText, PenTool, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type EditBlogFormProps = {
  blogId: string;
};

const EditBlogForm: React.FC<EditBlogFormProps> = ({ blogId }) => {
  const queryClient = useQueryClient();
  const authService = new AuthService();
  const router = useRouter();

  const { data: blog, isLoading, error } = useQuery<Blog>({
    queryKey: ["blog", blogId],
    queryFn: () => BlogService.getBlogById(blogId),
  });

  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (blog) {
      setForm({
        title: blog.title,
        content: blog.content,
      });
    }
  }, [blog]);

  const mutation = useMutation({
    mutationFn: async () => {
      const userId = await authService.getCurrentUserId();
      if (!userId) throw new Error("Not authenticated");

      let image_url: string | undefined = blog?.image_url;

      if (imageFile) {
        const uploadResult = await BlogService.uploadImage(imageFile);
        if (!uploadResult) throw new Error("Image upload failed");
        image_url = uploadResult;
        console.log("image successfully uploaded", image_url);
      }

      return BlogService.updateBlog(blogId, {
        title: form.title,
        content: form.content,
        image_url: image_url,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", blogId] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog updated successfully!");
      router.push("/blog");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update blog");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto"></div>
        <p className="text-lg text-muted-foreground animate-pulse">Loading blog for editing...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-lg text-destructive">Failed to load blog</p>
        <Link href="/blog">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Edit3 className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Edit Blog Post
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">Update your story and make it even better</p>
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
              <CardTitle className="text-2xl font-bold">Update Your Story</CardTitle>
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-muted-foreground">Make changes to your blog post and share your updated thoughts</p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Current Image Preview */}
            {blog?.image_url && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Image className="w-4 h-4" />
                  Current Featured Image
                </label>
                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-muted">
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileText className="w-4 h-4" />
                  Blog Title
                </label>
                <Input
                  name="title"
                  placeholder="Enter an engaging title for your blog..."
                  value={form.title}
                  onChange={handleChange}
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
                  name="content"
                  placeholder="Write your blog content here... Share your thoughts, experiences, and insights."
                  value={form.content}
                  onChange={handleChange}
                  required
                  rows={12}
                  className="min-h-[300px] text-base border-2 focus:border-primary/50 transition-all duration-300 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Image className="w-4 h-4" />
                  Update Featured Image (Optional)
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
                      <p className="text-sm text-primary font-medium">New image selected: {imageFile.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex gap-4">
                <Link href="/blog" className="flex-1">
                  <Button 
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full h-14 text-lg hover:bg-muted transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5 mr-3" />
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={mutation.isPending}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group h-14 text-lg"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                      Update Blog
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

export default EditBlogForm;
