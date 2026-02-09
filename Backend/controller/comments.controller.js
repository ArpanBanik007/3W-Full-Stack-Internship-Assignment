import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Comment from "../models/comments.models.js";
import Post from "../models/createpost.models.js";


/* ================= CREATE COMMENT ================= 
const createComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { content, parentComment } = req.body;
  const { postId } = req.params;

  if (!postId || !userId || !content?.trim()) {
    throw new ApiError(400, "Post ID and valid content are required");
  }

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  if (parentComment) {
    const parent = await Comment.findById(parentComment);
    if (!parent) throw new ApiError(404, "Parent comment not found");
    if (String(parent.post) !== postId) {
      throw new ApiError(400, "Parent comment does not belong to this post");
    }
  }

  const newComment = await Comment.create({
    content: content.trim(),
    user: userId,
    post: postId,
    parentComment: parentComment || null,
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: { commentsCount: 1 },
  });

  await newComment.populate("user", "username avatar");

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment added successfully"));
});*/


const createPostComment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { content } = req.body;
  const { postId } = req.params;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const comment = await Comment.create({
    content: content.trim(),
    user: userId,
    post: postId,
  });

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $inc: { commentsCount: 1 } },
    { new: true }
  );

  await comment.populate("user", "username avatar");

  // 🔥 SAME SOCKET, SAME ROOM
  req.io.to(`post:${postId}`).emit("comment-count-updated", {
    postId,
    commentsCount: updatedPost.commentsCount,
  });

  res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
});


export const getAllCommentsForPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const postExists = await Post.exists({ _id: postId });
  if (!postExists) throw new ApiError(404, "Post not found");

  const comments = await Comment.find({
    post: postId,
    parentComment: null,
  })
    .populate("user", "username avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const commentIds = comments.map((c) => c._id);

  const replyCounts = await Comment.aggregate([
    { $match: { parentComment: { $in: commentIds } } },
    { $group: { _id: "$parentComment", count: { $sum: 1 } } },
  ]);

  const replyMap = {};
  replyCounts.forEach((r) => {
    replyMap[r._id.toString()] = r.count;
  });

  const finalComments = comments.map((c) => ({
    ...c,
    replyCount: replyMap[c._id.toString()] || 0,
  }));

  res
    .status(200)
    .json(new ApiResponse(200, finalComments, "Comments fetched successfully"));
});

/* ================= GET REPLIES ================= */
export const getRepliesByCommentIdForPost = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const replies = await Comment.find({
    parentComment: commentId,
  })
    .populate("user", "username avatar")
    .sort({ createdAt: 1 });

  res
    .status(200)
    .json(new ApiResponse(200, replies, "Replies fetched"));
});

/* ================= GET REPLIES ================= */
const getRepliesByCommentId = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const parent = await Comment.findById(commentId);
  if (!parent) throw new ApiError(404, "Parent comment not found");

  const replies = await Comment.find({ parentComment: commentId })
    .populate("user", "username avatar")
    .sort({ createdAt: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, replies, "Replies fetched"));
});

/* ================= REPLY TO COMMENT ================= */
const commentReply = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content?.trim()) {
    throw new ApiError(400, "Reply content required");
  }

  const parent = await Comment.findById(commentId);
  if (!parent) throw new ApiError(404, "Parent comment not found");

  const reply = await Comment.create({
    content: content.trim(),
    user: userId,
    parentComment: commentId,
    post: parent.post,
  });

  await reply.populate("user", "username avatar");

  return res
    .status(201)
    .json(new ApiResponse(201, reply, "Reply posted"));
});

/* ================= UPDATE COMMENT ================= */
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Content required");
  }

  const updated = await Comment.findOneAndUpdate(
    { _id: commentId, user: req.user._id },
    { $set: { content: content.trim() } },
    { new: true }
  ).populate("user", "username avatar");

  if (!updated) {
    throw new ApiError(404, "Comment not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Comment updated"));
});

/* ================= DELETE COMMENT ================= */
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findOne({
    _id: commentId,
    user: req.user._id,
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found or unauthorized");
  }

  await Comment.deleteMany({ parentComment: commentId });
  await comment.deleteOne();

  await Post.findByIdAndUpdate(comment.post, {
    $inc: { commentsCount: -1 },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted"));
});

/* ================= LIKE / UNLIKE COMMENT ================= */
const toggleLikeOnComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const liked = await Comment.exists({
    _id: commentId,
    likes: userId,
  });

  const updated = await Comment.findByIdAndUpdate(
    commentId,
    liked
      ? { $pull: { likes: userId }, $inc: { likesCount: -1 } }
      : { $addToSet: { likes: userId }, $inc: { likesCount: 1 } },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, {
      _id: updated._id,
      likesCount: updated.likesCount,
      likedByCurrentUser: !liked,
    })
  );
});

export {
  createPostComment,

  getRepliesByCommentId,
  commentReply,
  updateComment,
  deleteComment,
  toggleLikeOnComment,
};