import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch,useSelector} from "react-redux"
import {startLogin,login,loginError} from '../app/user/userSlice.js';
import OAuth from "../components/OAuth.jsx";


function SignIn() {
  const [formdata, setFormdata] = useState({});
  const [successMessage, setsuccessMessage] = useState(null);
  const navigate = useNavigate();
  const {loading,error:errorMessage} = useSelector((state)=>(state.user))
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(startLogin());
      const data = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      
      const res = await data.json();
      if (res.success === false) {
        dispatch(loginError(res.message));
        setsuccessMessage(null);
      } 
      if(data.ok) {
        setsuccessMessage(res.message);
        dispatch(login(res));
        setTimeout(() => {
          navigate('/')
        }, 500);
      }
      
    } catch (error) {
      dispatch(loginError(error.message));
    }
  };

  return (
    <div className=" min-h-screen">
      <div className="  mt-20 max-w-3xl mx-auto px-16 md:px-5 flex flex-col md:flex-row gap-20 justify-center items-center ">
        {/* left */}
        <div className=" flex-1 flex flex-col items-center md:items-start">
          <Link to={"/"} className=" text-4xl text-black font-bold">
            OpenPost
          </Link>
          <p className="mt-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
            vero perferendis tempore dolorem necessitatibus minima!
          </p>
        </div>

        {/* right */}
        <div className="flex-1 flex flex-col min-w-80 ">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                id="email"
                placeholder="user@gmail.com"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                id="password"
                placeholder="*******"
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-2">
            <span>Does't have account?</span>
            <Link className=" text-blue-500 hover:text-blue-700" to={"/signup"}>
              Sign up
            </Link>
          </div>
          {errorMessage && (
            <Alert color="failure" className="mt-4">
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert color="success" className="mt-4">
              {successMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
