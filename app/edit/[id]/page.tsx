
import EditBlogForm from "@/app/components/editblog";
export default function EditBlogPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <EditBlogForm blogId={params.id} />
    </div>
  );
}
