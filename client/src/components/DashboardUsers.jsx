import { Alert, Button, Modal, ModalBody, ModalHeader, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaCheck,FaTimes } from "react-icons/fa";
import { CiWarning } from "react-icons/ci";
import { errorDisplay } from "../../../utils/error";

function DashboardPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [fetchingError, setFetchingError] = useState(null);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setshowModal] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState('')
  useEffect(() => {
    const fetchusers = async () => {
      try {
        const response = await fetch(
          `/api/users/getusers`
        );
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
          if (data.users.length < 10) {
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
      const startingindex = users.length;
    
      try {
        const response = await fetch(
          `/api/users/getusers?startIndex=${startingindex}`
        );
        const data = await response.json();
        if (response.ok) {
          if (data.users.length < 10) {
            setShowMore(false);
          }
          setUsers((prev)=> ([...prev,...data.users]));
        } else {
          setFetchingError(data.message);
        }
      } catch (error) {
        setFetchingError(error.message);
      }
    
  };

  const handleDeleteButtonClick = async (data)=>{
    setshowModal(true);
    setUserIdToDelete(data)
    // console.log(postIdToDelete);

  }

  const handleUserDelete = async ()=>{
    setshowModal(false);
    try {
      const res = await fetch(`/api/users/delete/${userIdToDelete}`, {
        method: "DELETE",
        
      });
      const data = await res.json();
      if(res.ok) {
        setUserIdToDelete(null)
        setUsers((users)=>users.filter((user)=>userIdToDelete !== user._id))

      }else{
        return errorDisplay(data.status, data.message);
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
    <div className=" flex items-center flex-col p-3 w-full flex-1 md:mx-auto overflow-x-scroll scrollbar scrollbar-track-gray-700 scrollbar-thumb-gray-500 dark:scrollbar-track-gray-500 dark:scrollbar-thumb-gray-400">
      {currentUser.isAdmin && users.length > 0 ? (
        <Table className=" shadow" hoverable>
          <Table.Head className="">
            <Table.HeadCell className=" whitespace-nowrap">
              Creation Time
            </Table.HeadCell>
            <Table.HeadCell className=" whitespace-nowrap">
              Profile Pic
            </Table.HeadCell>
            <Table.HeadCell className=" whitespace-nowrap">
              Username
            </Table.HeadCell>
            <Table.HeadCell className=" whitespace-nowrap">
              email
            </Table.HeadCell>
            <Table.HeadCell className=" whitespace-nowrap">Admin</Table.HeadCell>
            <Table.HeadCell className=" whitespace-nowrap">
              delete
            </Table.HeadCell>
          </Table.Head>
          {users.map((user) => (
            <Table.Body
              className=" divide-y border-t-2 border-t-gray-200 dark:border-t-gray-700"
              key={user._id}
            >
              <Table.Row>
                <Table.Cell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </Table.Cell>

                <Table.Cell>
                    <img
                      src={user.profilePic}
                      alt={`${user.usernames}`}
                      className="w-20 bg-gray-500 h-12 object-cover"
                    />
                </Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.isAdmin ? (<FaCheck className=" text-teal-400 ml-3"/>):(<FaTimes className="text-red-400 ml-3"/>)}</Table.Cell>
                
                
                <Table.Cell>
                    <span onClick={()=>handleDeleteButtonClick(user._id)} className=" hover:underline hover:cursor-pointer text-red-400">
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
          <Button color={"failure"} onClick={handleUserDelete}>
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
