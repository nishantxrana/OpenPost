import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon,FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../app/theme/themeSlice";
import { logout } from "../app/user/userSlice";



function Header() {
  const {theme} = useSelector((state)=>state.theme)
  const dispatch = useDispatch()
  const currentLocation = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);

  const handleLogOut  =async () => {
    try {
     const data = await fetch('/api/users/logout',{
       method: 'POST',
     })
     const res = await data.json()
     if(data.ok){
       dispatch(logout());
     }
     else{
       console.log(res.message);
     }
    } catch (error) {
     console.log(error.message);
    }}
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
        <div className=" hidden sm:inline">

        <TextInput
          type="text"
          placeholder="Search.."
          rightIcon={AiOutlineSearch}
          className=" inline"
          sizing={'sm'}
          
        />
        </div>
      </form>
      
      <div className="flex justify-center items-center gap-3 md:order-2">
        <Button className="  w-10 h-10 " color={"gray"} pill onClick={()=>dispatch(toggleTheme())}>
          {theme === "light" ? <FaSun/> : <FaMoon/>}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar img={currentUser.profilePic} rounded />}
          >
            <Dropdown.Header>
             <span className="block mb-1"><span className=" font-semibold mr-1">User:</span>{currentUser.username}</span>
            
             <span className="block"><span className=" font-semibold mr-1">Mail:</span>{currentUser.email}</span>
            </Dropdown.Header>
            {/* <Dropdown.Divider/> */}
            <Dropdown.Item>
              <Link to={"/dashboard?tab=profile"}>Profile</Link>
            </Dropdown.Item>
            <Dropdown.Divider/>
            <Dropdown.Item>
              <Link to={"/dashboard?tab/profile"} onClick={handleLogOut}>Sign Out</Link>
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
