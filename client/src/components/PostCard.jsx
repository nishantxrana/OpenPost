import React from "react";
import moment from "moment";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

function PostCard({ post }) {
  return (
    <div className=" flex border border-gray-200 dark:border-gray-900 h-80 group group-hover:bottom-1 relative w-80 transition-all duration-300 flex-col overflow-hidden rounded-xl bg-white dark:bg-[#18181B] bg-clip-border text-gray-700 shadow-md">
      <div className=" m-0 h-52 w-80 group-hover:h-40 overflow-hidden text-gray-700 bg-transparent rounded-none shadow-none bg-clip-border">
        <Link to={`/post/${post.slug}`} className="w-full">
          <img
            className="object-cover w-full group-hover:scale-110 h-full bg-gray-500 transition-all duration-300"
            src={post.image}
            alt="ui/ux review check"
          />
        </Link>
      </div>
      <div className="p-6 pt-4 flex-1 pb-3 h-30 transition-all duration-300">
        <Link to={`/post/${post.slug}`} className="w-full">
          <span className=" line-clamp-2">
            <h4 className="block dark:text-white  font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              {post.title}
            </h4>
          </span>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <p className="block border font-mono border-gray-700  rounded-full pr-2 pl-2  dark:text-gray-400  text-xs antialiased font-normal leading-relaxed text-gray-700">
            {post.category}
          </p>
          <p className="block  dark:text-gray-400  antialiased font-normal leading-relaxed text-xs">
            {moment(post.createdAt).fromNow()}
          </p>
        </div>
        <div className=" w-full p-5 pt-3 pb-4">
          <Link
            to={`/post/${post.slug}`}
            className="w-5/6 absolute bottom-[-200px] transition-all duration-300 group-hover:bottom-3 left-0 right-0 mx-auto"
          >
            <Button
              className="w-full group-hover:scale-90 transition-all duration-500 "
              size={"sm"}
              color={'dark'}
              pill
              type="button"
            >
              Read
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
