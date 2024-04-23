import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CiWarning } from "react-icons/ci";
import { errorDisplay } from "../../../utils/error";
import { BiSolidLike } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

function DashboardComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setcomments] = useState([]);
  const [fetchingError, setFetchingError] = useState(null);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [titleClickPost, setTitleClickPost] = useState("");
  useEffect(() => {
    const fetchusers = async () => {
      try {
        const response = await fetch(`/api/comment/getAllComments`);
        const data = await response.json();
        if (response.ok) {
          setcomments(data.comments);
          if (data.comments.length < 10) {
            setShowMore(false);
          }
        } else {
          setFetchingError(data.message);
        }
      } catch (error) {
        setFetchingError(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchusers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startingindex = comments.length;

    try {
      const response = await fetch(
        `/api/comment/getAllComments?startIndex=${startingindex}`
      );
      const data = await response.json();
      if (response.ok) {
        if (data.comments.length < 10) {
          setShowMore(false);
        }
        setcomments((prev) => [...prev, ...data.comments]);
      } else {
        setFetchingError(data.message);
      }
    } catch (error) {
      setFetchingError(error.message);
    }
  };

  const handleDeleteButtonClick = async (data) => {
    setshowModal(true);
    setCommentIdToDelete(data);
    // console.log(postIdToDelete);
  };

  const handleCommentDelete = async () => {
    setshowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCommentIdToDelete(null);
        setcomments((comment) =>
          comment.filter((comment) => commentIdToDelete !== comment._id)
        );
      } else {
        return errorDisplay(data.status, data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // for future if i want to redirect to post on clicking on the comment

  // const handleTitleClick = async (postId) => {
  //   try {
  //     const response = await fetch(
  //       `/api/post/getposts?postId=${postId}`
  //     );
  //     const data = await response.json();
  //     if (response.ok) {
  //       console.log(data.posts[0].slug);
  //       setTitleClickPost(data.posts[0].slug)
  //     } else {
  //       setFetchingError(data.message);
  //     }
  //   } catch (error) {
  //     setFetchingError(error.message);
  //   }
  // };

  return (
    <>
      {fetchingError && (
        <div className="w-full flex items-start  justify-center mt-5">
          <Alert className="" color={"failure"}>
            {fetchingError}
          </Alert>
        </div>
      )}
      <div className=" flex table-auto  flex-col p-3   flex-1  overflow-x-scroll  scrollbar-track-gray-700 scrollbar-thumb-gray-500 dark:scrollbar-track-gray-500 dark:scrollbar-thumb-gray-400">
        {currentUser.isAdmin && comments && comments.length > 0 ? (
          <Table className=" shadow">
            <Table.Head className="">
              <Table.HeadCell className=" whitespace-nowrap">
                Creation Time
              </Table.HeadCell>
              <Table.HeadCell className=" whitespace-nowrap">
                Comment
              </Table.HeadCell>
              <Table.HeadCell className=" whitespace-nowrap">
                Like Count
              </Table.HeadCell>
              <Table.HeadCell className=" whitespace-nowrap">
                User Id
              </Table.HeadCell>

              <Table.HeadCell className=" whitespace-nowrap">
                Post Id
              </Table.HeadCell>
              <Table.HeadCell className="text-red-500 whitespace-nowrap">
                delete
              </Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body
                className=" divide-y border-t-2 border-t-gray-200 dark:border-t-gray-700 hover:bg-gray-50 dark:hover:bg-[#0b0b0b]"
                key={comment._id}
              >
                <Table.Row>
                  <Table.Cell>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>
                    <span className="  line-clamp-4">{comment.content}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <div
                      className={`flex items-center justify-center gap-1 ${
                        comment.like.includes(currentUser._id)
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      <BiSolidLike />
                      {comment.likeCount}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>

                  <Table.Cell>
                    <div
                      onClick={() => handleDeleteButtonClick(comment._id)}
                      className="text-gray-500 h-7 hover:bg-gray-200 hover:border dark:border-gray-800 dark:hover:bg-gray-800 w-7 transition-all duration-300 rounded-full text-xl mx-auto flex justify-center items-center hover:text-red-500"
                    >
                      <MdDelete />
                    </div>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        ) : (
          <p>failed to load the comments for you</p>
        )}
        {showMore && (
          <Button
            color={"dark"}
            onClick={handleShowMore}
            pill
            className=" mt-5 self-center "
          >
            Load More
          </Button>
        )}
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
          <Button color={"failure"} onClick={handleCommentDelete}>
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

export default DashboardComments;
