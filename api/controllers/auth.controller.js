import { errorDisplay } from "../../utils/error.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

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
  // const hashedPassword = await bcryptjs.hash(password, 10);

  // creating new user
  const newUser = new User({
    username,
    email,
    password
  });

  // checking if there is an error
  try {
    await newUser.save();
    res.status(200).json({success:true,message: "successfully Signed Up"});
  } catch (error) {
    next(error);
  }
};
