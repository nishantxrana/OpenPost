import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../app/theme/themeSlice";
import { logout } from "../app/user/userSlice";
import { AiFillRobot, AiOutlineRobot } from "react-icons/ai";

function Header() {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const currentLocation = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);

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
  // console.log(currentUser);

  return (
    <Navbar className="w-full fixed z-50  mx-auto py-2 h-14 transition-all border-b bg-white dark:bg-[#0f0f0f]">
      <Link
        to={"/"}
        className=" text-nowrap pl-2 flex items-center gap-2 text-2xl  "
      >
        <span className="text-3xl  text-teal-500  ">
          <AiFillRobot />
        </span>

        <span className="font-mono hidden sm:inline transition-all duration-300 dark:text-white md:text-2xl text-black   font-bold">
          OpenPost
        </span>
      </Link>
      {/* <form>
        <div className=" hidden sm:inline">
          <TextInput
            type="text"
            placeholder="Search.."
            rightIcon={AiOutlineSearch}
            className=" inline"
            sizing={"sm"}
          />
        </div>
      </form> */}

      <div className="flex justify-center items-center gap-3 md:order-2">
        <Button
          className="  w-10 h-10 "
          color={"gray"}
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar img={currentUser.profilePic} rounded />}
          >
            <Dropdown.Header>
              <span className="block mb-1">
                <span className=" font-semibold mr-1">User:</span>
                {currentUser.username}
              </span>

              <span className="block">
                <span className=" font-semibold mr-1">Mail:</span>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            {/* <Dropdown.Divider/> */}
            <Dropdown.Item>
              <Link to={"/dashboard?tab=profile"}>Profile</Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Link to={"/dashboard?tab/profile"} onClick={handleLogOut}>
                Sign Out
              </Link>
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/signin"}>
            <Button outline gradientDuoTone="purpleToBlue" pill>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className="dark:bg-[#0f0f0f] bg-white">
        <Link to={"/"}>
          <Navbar.Link active={currentLocation === "/"} as={"div"} className="flex justify-center">
            {" "}
            {/* TODO: remember to use as div bcz anchor tags can't be nestted */}
            Home
          </Navbar.Link>
        </Link>
        <Link to={"/about"}>
          <Navbar.Link className="flex justify-center" active={currentLocation === "/about"} as={"div"}>
            About
          </Navbar.Link>
        </Link>
        <Link to={"/posts"}>
          <Navbar.Link className="flex justify-center" active={currentLocation === "/project"} as={"div"}>
            Posts
          </Navbar.Link>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
