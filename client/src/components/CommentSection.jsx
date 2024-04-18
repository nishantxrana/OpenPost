import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";
import Comment from "./Comment";

function AddComment({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);//kdkd
  const [comments, setComments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSuccessMessage(null);
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data,...comments])
        setSuccessMessage("comment added");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 1500);
        setTimeout(() => {
          setCommentError(null);
        }, 1500);
      } else {
        setCommentError(data.message);
        setTimeout(() => {
          setCommentError(null);
        }, 1000);
      }
    } catch (error) {
      setCommentError(error.message);
      
    }
  };

  useEffect(() => {
    const getPostComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data);
        }
      } catch (error) {
        setCommentError(error.message);
        setTimeout(() => {
          setCommentError(null);
        }, 1000);
      }
    };
    getPostComments();
  }, [postId]);

 

  return (
    <>
      {currentUser ? (
        <>
          <form className={` w-full mb-4 mt-6 pb-10 border-b max-w-2xl ${successMessage ? 'border-b-green-400 border-b-2':'border-b-gray-400'}`}>
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
                {comment ? (200 - comment.length):200} characters remaining
              </span>
              <div className="flex gap-3">
                <Button
                type="button"
                  pill
                  onClick={()=>setComment("")}
                  size={"xs"}
                  color={'gray'}
                  className="w-20"
                  disabled={comment ? false: true}


                  
                >
                  Cancel
                </Button>
                <Button
                  pill
                  disabled={comment ? false: true}
                  onClick={handleSubmit}
                  size={"xs"}
                  outline
                  gradientDuoTone={"purpleToBlue"}
                  className="w-20"
                >
                  Comment
                </Button>
              </div>
            </div>
            {commentError && (
              <Alert className="mt-4" color={"failure"}>
                {commentError}
              </Alert>
            )}
            
          </form>
        </>
      ) : (
        "login toh kr lay"
      )}
      {comments ? (
        comments.map((com)=>(
          <Comment key={com._id} com={com} />
        ))
      ):('no comments')}
    </>
  );
}

export default AddComment;
