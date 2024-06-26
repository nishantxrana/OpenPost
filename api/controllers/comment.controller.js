import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { errorDisplay } from "../../utils/error.js";

export const create = async (req, res, next) => {
  const { userId, postId, content } = await req.body;

  if (userId !== req.user.id) {
    return next(
      errorDisplay(400, "you are not allowed to comment on this post")
    );
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorDisplay(400, "post not found"));
    }
    const newComment = new Comment({
      userId,
      postId,
      content,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const commentLikeInfo = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorDisplay(400, "comment not found"));
    }
    const userIndex = comment.like.indexOf(req.user.id);
    if (userIndex != -1) {
      comment.likeCount -= 1;
      comment.like.splice(userIndex, 1);
    } else {
      comment.likeCount += 1;
      comment.like.push(req.user.id);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorDisplay(400, "comment not found"));
    }
    if (comment.userId === req.user.id || req.user.isAdmin) {
      await Comment.findByIdAndDelete(req.params.commentId);
      res.status(200).json({ message: "comment deleted successfully" });
    } else {
      return next(
        errorDisplay(400, "you are not allowed to delete this comment")
      );
    }
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorDisplay(400, "you are not allowed to delete this comment")
    );
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const comments = await Comment.find()
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: sortOrder });

    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthago = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const commentsOneMonthago = await Comment.countDocuments({
      createdAt: { $gte: oneMonthago },
    });

    res.status(200).json({
      comments,
      totalComments,
      commentsOneMonthago,
    });
  } catch (error) {
    next(error);
  }
};
