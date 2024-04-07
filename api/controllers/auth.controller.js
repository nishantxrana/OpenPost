import { errorDisplay } from "../../utils/error.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
  const { username, email, password } = await req.body;
  // console.log(username, email, password);

  // checking if any of the feilde is empty
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorDisplay(400, "fill all fields"));
  }

  //checking if user already exists
  // const existingUser = await User.findOne({$or: [{username}, {email}]}); //TODO: this is just a abstraction try catch will also do that

  // if(existingUser){
  //     return res.status(400).json({message: "User already exists"});
  // }

  //simple hasshing
  const hashedPassword = await bcryptjs.hash(password, 10);

  // creating new user
  const newUser = new User({
    username,
    email,
    password:hashedPassword,
  });

  // checking if there is an error
  try {
    await newUser.save();
    res.status(200).json({success:true,message: "successfully Signed Up"});
  } catch (error) {
    next(error);
  }
};

export const signin = async(req, res, next)=> {
  const { email, password } = await req.body;

  // checking if any of the feild is empty
  if (!email ||!password || email === "" || password === "") {
    next(errorDisplay(400, "fill all fields"));
  }
  //checking if user already exists

  try {
    const existingUser = await User.findOne({email});
    if(!existingUser) {
      return res.status(400).json({success:false,message: "User does not exist"});
    }
    // checking if password is correct
    
    const passCheck = await bcryptjs.compare(password, existingUser.password);
    if(!passCheck ){
      return res.status(400).json({success:false,message: "Password is incorrect"});
    }

    //spreading the existing user to remove password from it
    const {password:pas,...rest} = existingUser._doc
    // if password is correct send authentication token
    const token = jwt.sign({id : existingUser._id}, process.env.Token_key,{expiresIn:'1d'});
    res.status(200).cookie('login_token',token,{httpOnly:true}).json({rest}); //TODO: in this we need to send cookie first 
    
    
  } catch (error) {
    next(error)
  }
}
