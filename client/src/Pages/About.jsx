import React from 'react';
import {Link} from 'react-router-dom'

function About() {
  return (
    <section className=" pt-14 flex items-center justify-center h-screen">
      <div className=" rounded-lg px-6 md:px-10 lg:px-12 xl:px-14 py-6">
        <h1 className=" text-center mb-4 text-4xl font-semibold">Welcome to OpenPost</h1>
        <p className=" text-center text-xl">
          OpenPost is your one-stop shop for insightful articles, engaging stories, and diverse perspectives. We offer a wide range of topics, from technology and science to culture and lifestyle, all written by our talented team of contributors.
        </p>
        <div className='flex flex-col  md:flex-row items-start w-full px-4 md:justify-center  my-3 '>
          <p className="mt-3   text-xl">
            Our mission is to empower you to:
          </p>
          <ul className=" mt-4 mx-auto md:mx-8 list-disc">
            <li>Gain knowledge</li>
            <li>Spark meaningful conversations</li>
            <li>Foster a sense of community</li>
          </ul>
        </div>
        

          
        <p className=" text-center text-xl">
          <Link to={'/signup'} className='mr-2 text-blue-500'>
          Join us
          </Link>
           on OpenPost and embark on a journey of discovery, learning, and connection.
        </p>
      </div>
    </section>
  );
}

export default About;
