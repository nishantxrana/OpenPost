import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import {AiFillRobot} from 'react-icons/ai'

function SignUp() {
  const [formdata, setFormdata] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setsuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      
      const res = await data.json();
      if (res.success === false) {
        setErrorMessage(res.message);
        setsuccessMessage(null);
      } else {
        setsuccessMessage(res.message);
        setErrorMessage(null);
        setTimeout(() => {
          navigate('/signin')
        }, 1000);
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen">
      <div className="  pt-32 max-w-3xl mx-auto px-20 md:px-5 flex flex-col md:flex-row gap-20 justify-center items-center ">
        {/* left */}
        <div className=" flex-1 flex flex-col items-center md:items-start">
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
          <p className="mt-4 text-center">
          Welcome to OpenPost - your platform for sharing stories, exchanging ideas, and connecting with a diverse community.
          </p>
        </div>

        {/* right */}
        <div className="flex-1 flex flex-col min-w-80 ">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Username" />
              <TextInput
                type="text"
                id="username"
                placeholder="user@123"
                onChange={handleChange}
              />
            </div>
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
                "Sign Up"
              )}
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-2">
            <span>Already have an account?</span>
            <Link className=" text-blue-500 hover:text-blue-700" to={"/signin"}>
              Sign In
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

export default SignUp;
