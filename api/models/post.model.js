import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId:{
            type:String,
            required: true,
        },
        title:{
            type: String,
            required: true,
            unique: true,
        },
        content:{
            type: String,
            required: true,

        },
        image:{
            type: String,
            default: "https://bernardmarr.com/wp-content/uploads/2022/04/The-10-Biggest-Technology-Trends-That-Will-Transform-The-Next-Decade-800x534.jpg",
           
        },
        category:{
            type: String,
            default:'uncategorized'
        },
        slug:{
            type: String,
            required: true,
            unique: true,
        }
    },{timestamps:true}
);

const Post = mongoose.model("Post", postSchema);

export default Post;