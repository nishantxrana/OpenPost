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

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = req.query.startIndex || 0;
    const limit = req.query.limit || 12;
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.search && {
        $or: [
          {
            title: {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            content: {
              $regex: req.query.search,
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
    res.status(200).json(
      {
        posts,
        totalPosts,
        postsOneMonthAgo,
      }
    );
  } catch (error) {
    next(error);
  }
};
