import React from 'react'
import ViewBlog from '@/app/components/view-blog'

interface Props {
    params:Promise<{id:string}>;
}
const page = async (props:Props) => {
  const params = await props.params;  
  const {id } =  params;
  return (
    <ViewBlog  blogId={id}/>
  )
}

export default page