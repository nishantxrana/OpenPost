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
            default: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/330px-SpongeBob_SquarePants_character.svg.png",
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