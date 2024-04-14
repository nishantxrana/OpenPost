import { Button } from 'flowbite-react'
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import {GoogleAuthProvider,getAuth,signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { login } from '../app/user/userSlice.js';
import { useNavigate } from 'react-router-dom';




function OAuth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = getAuth(app);
    const handleGoogleSignin = async ()=>{
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt:'select_account'})
        try {
            const googleResult = await signInWithPopup(auth,provider);
            // console.log(googleResult);
            const response = await fetch('/api/auth/google',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    
                    username:googleResult.user.displayName,
                    email:googleResult.user.email,
                    photo:googleResult.user.photoURL
                })
                
            })
            const data = await response.json();
            if(response.ok){
                dispatch(login(data));
                console.log('working');
                navigate('/');
            }
            
        } catch (error) {
            console.log(error);
        }
        
        
    }
  return (
    <Button type='button' color='light' onClick={handleGoogleSignin}>
        <FcGoogle className=' w-6 h-6 mr-3'/>
        <span>Continue with Google</span>
    </Button>
  )
}

export default OAuth