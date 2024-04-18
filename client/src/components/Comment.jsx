import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BiSolidLike } from "react-icons/bi";
import moment from 'moment'


function Comment({ com }) {
  const { currentUser } = useSelector((state) => state.user);
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await fetch(`/api/users/getUserDetails/${com.userId}`);
        const data = await response.json();
        if (response.ok) {
          setUserDetail(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUserDetails();
  }, [com]);



  return (
    <div className=" mb-4 max-w-2xl  w-full flex gap-2 p-2">
      <div className="max-w-10 max-h-10 bg-gray-300 rounded-full ">
        {userDetail && (
          <img
            className="  object-cover w-full h-full rounded-full"
            src={userDetail.profilePic ? userDetail.profilePic :('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')}
            alt="user profile pic"
          />
        )}
      </div>
      <div className=" flex-1 p-1 pt-0 items-center">
        <div className="flex gap-2 mb-1">
          <span className="text-xs italic font-semibold">
            {userDetail  ? ("@" + userDetail.username) : ('@anonymous')}
          </span>
          <span className="text-[.65rem] text-gray-400">
            {com &&
              moment(com.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-sm">{userDetail && com.content}</p>
        <div className="flex gap-3 mt-3">
          <span className="flex gap-1 items-center">
            <BiSolidLike className="text-gray-500 hover:text-blue-500" />
            <span className="text-xs">{com && com.likeCount}</span>
          </span>
          {currentUser && com && com.userId === currentUser._id && (
            <span className="text-xs">Edit</span>
          )}
          {currentUser && currentUser.isAdmin && (
            <span className="text-xs">Delete</span>
          )}
        </div>
      </div>
      <div>...</div>
    </div>
  );
}

export default Comment;
