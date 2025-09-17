import { useMutation } from "@tanstack/react-query";
import { BlogService } from "@/app/backend/blog.service";

interface BlogFormInput {
  title: string;
  content: string;
  image?: File | null;
}

export const useCreateBlog = () => {
  return useMutation({
    mutationFn: async ({ title, content, image }: BlogFormInput) => {
      return await BlogService.createBlog({ title, content }, image || undefined);
    },
  });
};
