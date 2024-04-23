import { Alert, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

function Posts() {
  const [posts, setPosts] = useState(null);
  const [showMore, setShowMore] = useState(true);
  const [FetchingError, setFetchingError] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/post/getposts?limit=9`);
        const data = await response.json();
        if (response.ok) {
          setPosts(data.posts);
          if (data.posts.length < 9) {
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

  const handleShowMore = async () => {
    const startingindex = posts.length;

    try {
      const response = await fetch(
        `/api/post/getposts?startIndex=${startingindex}&limit=9`
      );
      const data = await response.json();
      if (response.ok) {
        if (data.posts.length < 9) {
          setShowMore(false);
        }
        console.log("yes");
        setPosts((prev) => [...prev, ...data.posts]);
      } else {
        setFetchingError(data.message);
      }
    } catch (error) {
      setFetchingError(error.message);
    }
  };

  return (
    <div className="pt-14 w-full h-full pb-6   px-4">
      <div>
        <h1 className="text-4xl my-4 font-bold dark:text-white text-center text-gray-900">
          Posts
        </h1>
      </div>
      <div className="w-full  flex flex-wrap justify-evenly  h-full">
        {posts &&
          posts.map((post) => (
            <div key={post._id} className="mr-4 mb-4">
              <PostCard post={post} />
            </div>
          ))}
      </div>
      {FetchingError && <Alert>{FetchingError}</Alert>}
      {showMore && (
        <Button
          onClick={handleShowMore}
          color={"dark"}
          pill
          className="mx-auto mb-5 mt-6"
        >
          <span>Load More</span>
        </Button>
      )}
    </div>
  );
}

export default Posts;
