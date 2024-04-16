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
    .map((word) => word.toLowerCase()) // Ensure all words are lowercase
    .join("-")
    .replace(/[^a-zA-Z0-9-]+/g, "");

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

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.searchTerm && {
        $or: [
          {
            title: {
              $regex: req.query.searchTerm,
              $options: "i",
            },
          },
          {
            content: {
              $regex: req.query.searchTerm,
              $options: "i",
            },
          },
        ],
      }),
    })
      .sort({ updatedAt: sortOrder })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const timeOneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const postsOneMonthAgo = await Post.countDocuments({
      createdAt: { $gte: timeOneMonthAgo },
    });
    res.status(200).json({
      posts,
      totalPosts,
      postsOneMonthAgo,
    });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.query.userId) {
    return next(errorDisplay(400, "you are not allowed to delete post"));
  }
  try {
    await Post.findByIdAndDelete(req.query.postId);
    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id != req.query.userId) {
    return next(errorDisplay(400, "you are not allowed to update post"));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.query.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          image: req.body.image,
          category: req.body.category,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
