import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { PiSignOut } from "react-icons/pi";
import { HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../app/user/userSlice";
import { BsFileEarmarkPost } from "react-icons/bs";

function DashboardSidebar() {
  const location = useLocation();
  const [tab, settab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const UrlParameters = new URLSearchParams(location.search);
    const tabFromURL = UrlParameters.get("tab");
    if (tabFromURL) {
      settab(tabFromURL);
    }
  }, [location.search]);

  const handleLogOut = async () => {
    try {
      const data = await fetch("/api/users/logout", {
        method: "POST",
      });
      const res = await data.json();
      if (data.ok) {
        dispatch(logout());
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="h-full">
      <Sidebar className="flex flex-col w-full sm:min-w-60 flex-1 overflow-y-auto">
        <Sidebar.Items>
          <Sidebar.ItemGroup as={"div"} className="flex flex-col gap-1">
            <Link to={"/dashboard?tab=profile"}>
              <Sidebar.Item
                active={tab === "profile"}
                label={currentUser.isAdmin ? "Admin" : "user"}
                labelColor="dark"
                icon={HiUser}
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>
            <Link to={"/dashboard?tab=posts"}>
              <Sidebar.Item
                icon={BsFileEarmarkPost}
                active={tab === "posts"}
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
            <Sidebar.Item
              className="cursor-pointer"
              icon={PiSignOut}
              onClick={handleLogOut}
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

export default DashboardSidebar;
