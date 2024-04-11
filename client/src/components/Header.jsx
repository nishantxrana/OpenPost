import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon,FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../app/theme/themeSlice";


function Header() {
  const {theme} = useSelector((state)=>state.theme)
  const dispatch = useDispatch()
  const currentLocation = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser);

  return (
    <Navbar className=" border-b-2">
      <Link
        to={"/"}
        className=" text-sm sm:text-xl text-white text-nowrap font-semibold dark:text-white p-2 bg-black rounded-full"
      >
        OpenPost
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search.."
          rightIcon={AiOutlineSearch}
          className=" hidden lg:inline"
        />
      </form>
      <Button
        className="lg:hidden w-12 h-10 flex justify-center items-center"
        color={"gray"}
        pill
      >
        <AiOutlineSearch />
      </Button>
      <div className="flex justify-center items-center gap-2 md:order-2">
        <Button className="  w-12 h-10 " color={"gray"} pill onClick={()=>dispatch(toggleTheme())}>
          {theme === "light" ? <FaSun/> : <FaMoon/>}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar img={currentUser.rest.profilePic} rounded />}
          >
            <Dropdown.Header>
             <span className="block mb-1"><span className=" font-semibold mr-1">User:</span>{currentUser.rest.username}</span>
            
             <span className="block"><span className=" font-semibold mr-1">Mail:</span>{currentUser.rest.email}</span>
            </Dropdown.Header>
            {/* <Dropdown.Divider/> */}
            <Dropdown.Item>
              <Link to={"/dashboard?tab=profile"}>Profile</Link>
            </Dropdown.Item>
            <Dropdown.Divider/>
            <Dropdown.Item>
              <Link to={"/dashboard?tab/profile"}>Sign Out</Link>
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
      <Navbar.Collapse>
        <Navbar.Link active={currentLocation === "/"} as={"div"}>
          {" "}
          {/* TODO: remember to use as div bcz anchor tags can't be nestted */}
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={currentLocation === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
        <Navbar.Link active={currentLocation === "/project"} as={"div"}>
          <Link to={"/project"}>Project</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
