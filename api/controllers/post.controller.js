import { errorDisplay } from "../../utils/error.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorDisplay(400, "you are not allowed to create post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorDisplay(400, "fill all fields"));
  }
  const slug = req.body.title
  .split(" ")
  .map(word => word.toLowerCase())  // Ensure all words are lowercase
  .join("-")
  .replace(/[^a-zA-Z0-9-]+/g, '');

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
};
