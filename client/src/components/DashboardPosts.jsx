import { Button, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
function DashboardPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [fetchingError, setFetchingError] = useState(null);
  console.log(userPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/post/getPosts?userId:${currentUser._id}`
        );
        const data = await response.json();
        if (response.ok) {
          setUserPosts(data.posts);
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
  console.log(userPosts);

  return (
    <div className="p-3 table-auto md:mx-auto overflow-x-scroll scrollbar scrollbar-track-gray-700 scrollbar-thumb-gray-500 dark:scrollbar-track-gray-500 dark:scrollbar-thumb-gray-400">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <Table hoverable>
          <Table.Head>
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
            <Table.Body className=" divide-y border-t-2 border-t-gray-200 dark:border-t-gray-700" key={post._id}>
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
                <Table.Cell className=" text-nowrap">
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  <Link to={`/updatePost/${post.slug}`}>
                    <span className=" hover:underline text-teal-400">Edit</span>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link to={``}>
                    <span className=" hover:underline text-red-400">Delete</span>
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      ) : (
        <p>failed to load the posts for you</p>
      )}
    </div>
  );
}

export default DashboardPosts;
