
import EditBlogForm from "@/app/components/editblog";
interface Props {
    params:Promise<{id:string}>;
}
const page = async (props:Props) => {
  const params = await props.params;  
  const {id } =  params;
  return (
    <EditBlogForm
    blogId={id}/>
  )
}

export default page
