import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

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
