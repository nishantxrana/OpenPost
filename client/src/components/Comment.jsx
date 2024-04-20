import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BiSolidLike } from "react-icons/bi";
import moment from "moment";
import { MdDelete, MdEdit } from "react-icons/md";
import { CiWarning } from "react-icons/ci";
import { Modal, ModalBody, ModalHeader, Button } from "flowbite-react";

function Comment({ com, onLike, deleteComment }) {
  const { currentUser } = useSelector((state) => state.user);
  const [userDetail, setUserDetail] = useState(null);
  const [showModal, setshowModal] = useState(false);

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
    <>
      <div className=" mb-4 max-w-2xl  w-full flex gap-2 p-2">
        <div className="max-w-10 max-h-10 bg-gray-300 rounded-full ">
          {userDetail && (
            <img
              className="  object-cover w-full h-full rounded-full"
              src={
                userDetail.profilePic
                  ? userDetail.profilePic
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="user profile pic"
            />
          )}
        </div>
        <div className=" flex-1 p-1 pt-0 items-center">
          <div className="flex gap-2 mb-1">
            <span className="text-xs italic font-semibold">
              {userDetail ? "@" + userDetail.username : "@anonymous"}
            </span>
            <span className="text-[.65rem] text-gray-400">
              {com && moment(com.createdAt).fromNow()}
            </span>
          </div>
          <p className="text-sm">{userDetail && com.content}</p>
          <div className="flex gap-3 mt-3">
            <div className="flex gap-1 items-center">
              <button
                type="button"
                onClick={() => onLike(com._id)}
                className={`${
                  currentUser && com && com.like.includes(currentUser._id)
                    ? "text-blue-500"
                    : "text-gray-500"
                } hover:text-blue-500`}
              >
                <BiSolidLike />
              </button>
              <span className="text-xs">{com && com.likeCount}</span>
            </div>
            {currentUser && com && com.userId === currentUser._id && (
              <span className=" hidden text-gray-500 hover:text-green-500">
                <MdEdit />
              </span>
            )}
            {currentUser &&
              com &&
              (currentUser.isAdmin || currentUser._id === com.userId) && (
                <div
                  onClick={() => setshowModal(true)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <MdDelete />
                </div>
              )}
          </div>
        </div>
        <div className="opacity-0">...</div>
      </div>
      <Modal
        show={showModal}
        onClose={() => setshowModal(false)}
        popup
        size="md"
      >
        <ModalHeader className=" w-full  bg-red-50">Warning</ModalHeader>
        <ModalBody className="mt-4 flex flex-col items-center">
          <CiWarning className=" text-5xl text-gray-500 mb-6" />
          <span className=" text-center">
            Are you sure you want to{" "}
            <span className=" text-red-400">delete</span> this post?
          </span>
        </ModalBody>
        <div className="flex justify-center gap-16 mt-4 mb-4">
          <Button
            color={"failure"}
            onClick={() => {
              deleteComment(com._id);
              setshowModal(false);
            }}
          >
            <span>Delete</span>
          </Button>
          <Button onClick={() => setshowModal(false)} color={"dark"}>
            <span>Cancel</span>
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Comment;
