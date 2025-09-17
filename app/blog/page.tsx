import BlogPage from "../components/blogPage";
import ViewBlog from "../components/view-blog";

export default function EditBlogPage({ params }: { params: { id: string } }) {
  return <>
  <BlogPage blogId={params.id}/>
  </>;
}