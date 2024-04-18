import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import { Button } from 'flowbite-react'
import AddComment from '../components/CommentSection.jsx';

function PostPage() {
    const {slug} = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    

    useEffect(() => {
        setLoading(true);
      const fetchPost = async ()=>{
        try {
            const response = await fetch(`/api/post/getposts?slug=${slug}`);
            const data = await response.json();
            if (response.ok) {
                setPost(data.posts[0]);
                setLoading(false);
            }
            else{
                setError(data.message);
                setLoading(false);
            }
            
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
      }
      fetchPost();
        
    }, [slug])
    
    if (loading) {
        return <div className=' text-4xl flex flex-1 w-full justify-center  items-center min-h-screen mx-auto'><span>Loading...</span></div>
    }
  return (
    <div className='flex p-3 flex-col mx-auto max-w-6xl justify-center items-center '>
    <h1 className='text-4xl font-medium font-serif pt-5 text-center'>{post.title}</h1>
    <Button className='mt-5 mb-5' pill size={'xs'} color={'gray'}>{post.category} </Button>
    <img src={post.image} alt="blog image" className=' shadow w-full max-w-5xl h-80 object-cover  sm:h-[450px] rounded-sm' />
    <div className='w-full mt-4 mb-4 max-w-3xl flex justify-between text-xs border-b-2 border-gray-200 p-2'>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className=' italic'>{(post.content.length/1000).toFixed(0) + ' min read'}</span>
    </div>
    <div dangerouslySetInnerHTML={{__html:post.content}} className='w-full max-w-3xl  px-2 post-content border-b border-gray-400 pb-5'></div>
    <AddComment postId={post._id}/>
    </div>
    
  )
}

export default PostPage