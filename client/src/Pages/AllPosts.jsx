import { Alert } from "flowbite-react";
import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

function Posts() {
  const [Posts, setPosts] = useState(null);
  const [showMore, setShowMore] = useState(null);
  const [FetchingError, setFetchingError] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/post/getposts?limit=10`);
        const data = await response.json();
        if (response.ok) {
          console.log(data);
          setPosts(data.posts);
          if (data.posts.length < 12) {
            setShowMore(false);
          }
        } else {
          setFetchingError(data.message);
        }
      } catch (error) {
        setFetchingError(error.message);
      }
    };

    fetchPosts();
  }, []);
  return (
    <div className="pt-14 w-full h-full border border-red-500 px-4">
      <div>
        <h1 className="text-3xl font-bold dark:text-white text-center text-gray-900">Posts</h1>
      </div>
      <div className="w-full border flex flex-wrap justify-evenly border-green-500 h-full">
        {Posts &&
          Posts.map((post) => (
            <div key={post._id} className="mr-4 mb-4">
              <PostCard post={post} />
            </div>
          ))}
      </div>
      {FetchingError && <Alert>{FetchingError}</Alert>}
    </div>
  );
}

export default Posts;
