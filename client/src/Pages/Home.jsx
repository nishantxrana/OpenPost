import React, { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import PostCard from "../components/PostCard";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

function Home() {
  const [latestPost, setLatestPost] = useState(null);
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("api/post/getposts?limit=1&startIndex=0");
        const data = await res.json();
        if (res.ok) {
          setLatestPost(data.posts[0]);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("api/post/getposts?limit=8&startIndex=1");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className=" w-full h-full pt-20 ">
      {latestPost && (
        <>
        <div className=" w-full  mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12  ">
        <h1 className="text-2xl font-serif text-center md:text-3xl font-semibold text-nowrap">
            Latest Post
          </h1>
          
        </div>
        <div className="flex p-3 flex-col mx-auto max-w-6xl justify-center items-center ">
          <img
            src={latestPost.image}
            alt="blog image"
            className=" shadow w-full max-w-5xl h-80 object-cover  sm:h-[450px] rounded-lg"
          />
          <div className="w-full flex justify-between max-w-5xl mt-5">
            <span className=" font-mono ">{latestPost.category} </span>
            <span className=" italic text-sm">
              {(latestPost.content.length / 1000).toFixed(0) + " min read"}
            </span>
          </div>
          <div className="w-full max-w-5xl">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl line-clamp-2 md:line-clamp-1 font-medium font-serif pt-1 ">
              {latestPost.title}{" "}
            </h1>
          </div>
          <Link to={`/post/${latestPost.slug}`}>
          <Button className="mt-5 mb-5 " pill size={"md"} color={"dark"}>
            <div className="flex items-center gap-1">
              <span>Read Full Post</span>
              <MdKeyboardDoubleArrowRight />
            </div>
          </Button>
          </Link>
        </div>
        </>
      )}
      <div className=" w-full  mx-auto my-5 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12  ">
        <div className="flex mb-6 px-2 justify-between items-center flex-nowrap ">
          <h1 className="text-2xl mr-10 md:text-3xl font-semibold text-nowrap">
            Most Recent Posts
          </h1>
          <p className=" text-xs md:text-lg font-mono text-nowrap flex items-center gap-2 text-blue-500 hover:text-blue-700 hover:cursor-pointer font-semibold">
            <Link to={'/posts'}>
            View All Posts
            </Link>
            <MdKeyboardDoubleArrowRight />
          </p>
        </div>
        <div className="flex justify-evenly items-center  flex-wrap">
          {posts ? (
            posts.map((post) => (
              <div className="mb-4 mx-2 testingOnly" key={post._id}>
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <div className="w-full h-screen flex  justify-center pt-72 ">
              <h1 className="text-3xl text-gray-500">Loading...</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
