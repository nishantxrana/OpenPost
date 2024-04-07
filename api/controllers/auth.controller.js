import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup =async (req,res)=>{
    const {username,email,password} = await req.body;
    console.log(username, email, password);
    // res.send({username, email, password});

    // checking if any of the feilde is empty
    if(!username ||!email ||!password || username === '' || email==='' || password === ''){
        return res.status(400).json({message: "Please fill all the fields"});
    }

    //checking if user already exists
    const existingUser = await User.findOne({$or: [{username}, {email}]}); //TODO: this is just a abstraction try catch will also do that

    if(existingUser){
        return res.status(400).json({message: "User already exists"});
    }

    //simple hasshing 
    const hashedPassword = await bcryptjs.hash(password, 10);

    // hashing password
    // const salt = await bcryptjs.genSalt(10);
    // const hashedPassword = await bcryptjs.hash(password, salt);


    // creating new user
    const newUser = new User({
        username,
        email,
        password:hashedPassword,
    });
    
    // checking if there is an error
    try {
        await newUser.save();
        res.send("successfully created");
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}