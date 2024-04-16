import { Alert, Button, Modal, ModalBody, ModalHeader, Table } from "flowbite-react";
import { STATES, syncIndexes } from "mongoose";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CiWarning } from "react-icons/ci";

function DashboardPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [fetchingError, setFetchingError] = useState(null);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setshowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState('')
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/post/getposts?userId=${currentUser._id}`
        );
        const data = await response.json();
        if (response.ok) {
          setUserPosts(data.posts);
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
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
      const startingindex = userPosts.length;
      console.log(startingindex);
    
      try {
        const response = await fetch(
          `/api/post/getposts?userId=${currentUser._id}&startIndex=${startingindex}`
        );
        const data = await response.json();
        if (response.ok) {
          if (data.posts.length < 12) {
            setShowMore(false);
          }
          setUserPosts((prev)=> ([...prev,...data.posts]));
        } else {
          setFetchingError(data.message);
        }
      } catch (error) {
        setFetchingError(error.message);
      }
    
  };

  const handleDeleteButtonClick = async (data)=>{
    setshowModal(true);
    setPostIdToDelete(data)
    // console.log(postIdToDelete);

  }

  const handlePostDelete = async ()=>{
    setshowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost?userId=${currentUser._id}&postId=${postIdToDelete}`, {
        method: "DELETE",
        
      });
      const data = await res.json();
      if(res.ok) {
        setPostIdToDelete(null)
        setUserPosts((posts)=>posts.filter((post)=>postIdToDelete !== post._id))

      }
      
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
    {fetchingError && (
      <div className="w-full flex items-start  justify-center mt-5">
      <Alert className="" color={'failure'}>
        {fetchingError}
      </Alert>
      </div>
    )}
    <div className=" flex items-center flex-col p-3 table-auto md:mx-auto overflow-x-scroll scrollbar scrollbar-track-gray-700 scrollbar-thumb-gray-500 dark:scrollbar-track-gray-500 dark:scrollbar-thumb-gray-400">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <Table className=" shadow" hoverable>
          <Table.Head className="">
            <Table.HeadCell className=" whitespace-nowrap">
              Creation Time
            </Table.HeadCell>
            <Table.HeadCell className=" whitespace-nowrap">
              Post image
            </Table.HeadCell>
            <Table.HeadCell className=" whitespace-nowrap">
              title
            </Table.HeadCell>
            <Table.HeadCell className=" whitespace-nowrap">
              category
            </Table.HeadCell>
            <Table.HeadCell className=" whitespace-nowrap">edit</Table.HeadCell>
            <Table.HeadCell className=" whitespace-nowrap">
              delete
            </Table.HeadCell>
          </Table.Head>
          {userPosts.map((post) => (
            <Table.Body
              className=" divide-y border-t-2 border-t-gray-200 dark:border-t-gray-700"
              key={post._id}
            >
              <Table.Row>
                <Table.Cell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </Table.Cell>

                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt="post image"
                      className="w-20 bg-gray-500 h-12 object-cover"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell className=" ">
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  <Link to={`/updatepost/${post._id}`}>
                    <span className=" hover:underline text-teal-400">Edit</span>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                    <span onClick={()=>handleDeleteButtonClick(post._id)} className=" hover:underline hover:cursor-pointer text-red-400">
                      Delete
                    </span>
                  
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      ) : (
        <p>failed to load the posts for you</p>
      )}
      {showMore && (
        <button
          onClick={handleShowMore}
          className=" mt-5 self-center text-teal-400"
        >
          Load More
        </button>
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
          <Button color={"failure"} onClick={handlePostDelete}>
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

export default DashboardPosts;
