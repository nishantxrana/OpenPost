import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";

function AddComment({postId}) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setSuccessMessage(null)
        const res = await fetch('/api/comment/create',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              content:comment,
              postId,
              userId: currentUser._id
            })
        })
        const data = await res.json()
        if (res.ok) {
          setComment('')
          setCommentError(null)
          setSuccessMessage('comment added')
          setTimeout(() => {
            setSuccessMessage(null)
          }, 1000);
          setTimeout(() => {
            setCommentError(null)
          }, 1000);
        }
        else {
          setCommentError(data.message)
        }
    } catch (error) {
        setCommentError(error.message)
    }
  }


  

  return (
    <>
      {currentUser ? (
        <>
          <form className=" w-full mt-6 mb-40 max-w-2xl">
            <div className="flex w-full items-center gap-1 text-xs">
              <span>Signed in as:</span>
              <img
                className="w-6 ml-1 h-6 object-cover rounded-full"
                src={currentUser.profilePic}
                alt="user profile pic"
              />
              <Link to={"/dashboard?tab=profile"}>
                <span className=" text-teal-400 ">@{currentUser.username}</span>
              </Link>
            </div>
            <Textarea
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
              className="mt-2"
              rows={3}
              maxLength={200}
              value={comment}
            />
            <div className="flex justify-between items-center mt-3 px-4">
              <span className="text-xs text-gray-500">
                {200 - comment.length} characters remaining
              </span>
              <Button onClick={handleSubmit} size={"xs"} outline gradientDuoTone={"purpleToBlue"}>
                Post
              </Button>
            </div>
          {commentError && (
            <Alert className="mt-4" color={'failure'}>Failed to add comment</Alert>
          )}
          {successMessage && (
            <div className="flex justify-center">
                <Alert  className="mt-4 inline-block" color={'success'}>{successMessage}</Alert>

            </div>
          )}
          </form>
          
        </>
      ) : (
        "login toh kr lay"
      )}
    </>
  );
}

export default AddComment;
