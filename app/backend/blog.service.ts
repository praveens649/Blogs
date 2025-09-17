import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { AuthService } from "./auth.service";

export interface Blog {
  id?: string;
  user_id?: string;
  author_username?: string;
  title: string;
  content: string;
  image_url?: string;
  status?: "published" | "reported";
  created_at?: string;
  updated_at?: string;
}
const authService = new AuthService();
export class BlogService {

  static async uploadImage(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = `blogs/${fileName}`;

    const { error } = await supabase.storage.from("blog-images").upload(filePath, file);
    if (error) {
      console.error("Storage upload error:", error);
      if (error.message.includes("Bucket not found")) {
        throw new Error("Storage bucket 'blog-images' not found. Please run the database schema setup.");
      }
      throw new Error(`Image upload failed: ${error.message}`);
    }

    const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);
    return data.publicUrl;
  }

  static async createBlog(blog: Blog, imageFile?: File) {
    try {
      const user = await authService.getCurrentUserId();
      const username = await authService.getCurrentUsername();
      
      if (!user) {
        throw new Error("User must be authenticated to create a blog");
      }

      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        imageUrl = await this.uploadImage(imageFile);
      }

      const { data, error } = await supabase.from("blogs").insert([{
        title: blog.title,
        content: blog.content,
        user_id: user,
        author_username: username,
        image_url: imageUrl,
      }]).select().single();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Database error: ${error.message || JSON.stringify(error)}`);
      }
      return data;
    } catch (error) {
      console.error("Blog creation error:", error);
      throw error;
    }
  }

static async getBlogs() { 
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  static async getBlogById(id: string) {
    const { data, error } = await supabase.from("blogs").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  static async updateBlog(
    id: string,
    blog: Partial<Blog>,
    imageFile?: File 
  ) {
    const currentUserId = await authService.getCurrentUserId();
    if (!currentUserId) {
      throw new Error("User must be authenticated to update a blog");
    }

    // Check if user owns this blog
    const { data: existingBlog, error: fetchError } = await supabase
      .from("blogs")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    
    if (existingBlog.user_id !== currentUserId) {
      throw new Error("You can only update your own blogs");
    }

    let imageUrl: string | undefined;
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      const filePath = `blogs/${fileName}`;
  
      const { error: uploadError } = await supabase.storage
        .from("blog-images") 
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: true,
        });
      if (uploadError) throw uploadError;
      const { data: imageData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);
  
      imageUrl = imageData.publicUrl;
    }
    const updatedBlog = {
      ...blog,
      ...(imageUrl && { image_url: imageUrl }), 
    };
    const { data, error } = await supabase
      .from("blogs")
      .update(updatedBlog)
      .eq("id", id)
      .select();
  
    if (error) throw error;
    return data;
  }

  static async deleteBlog(id: string) {
    const currentUserId = await authService.getCurrentUserId();
    if (!currentUserId) {
      throw new Error("User must be authenticated to delete a blog");
    }

    // Check if user owns this blog
    const { data: existingBlog, error: fetchError } = await supabase
      .from("blogs")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    
    if (existingBlog.user_id !== currentUserId) {
      throw new Error("You can only delete your own blogs");
    }

    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  }
}
