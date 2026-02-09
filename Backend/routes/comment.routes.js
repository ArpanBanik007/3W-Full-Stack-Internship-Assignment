import { Router } from "express";
import { verifyJWT } from "../middlewire/auth.middlewire.js";

import {
  
  
  getRepliesByCommentId,
  commentReply,
  updateComment,
  deleteComment,
  toggleLikeOnComment,
  createPostComment,
  
} from "../controller/comments.controller.js";

const router = Router();

/**
 * Comment Routes
 * 
 */


router.post("/post/:postId", verifyJWT, createPostComment);



// // ✅ Create new comment
// //router.route("/:videoId").post(verifyJWT, createComment);

// // ✅ Get all comments for a video (with pagination)
// router.route("/:videoId").get(getAllComments);

// // ✅ Update a comment (only by owner)
// router.route("/:videoId/:commentId").patch(verifyJWT, updateComment);

// // ✅ Delete a comment (only by owner)
// router.route("/:videoId/:commentId").delete(verifyJWT, deleteComment);

// // ✅ Get replies of a specific comment
// router.route("/replies/:commentId").get(getRepliesByCommentId);

// // ✅ Post a reply under a comment
// router.route("/reply/:commentId").post(verifyJWT, commentReply);

// // ✅ Toggle like/unlike on a comment
// router.route("/like/:commentId").post(verifyJWT, toggleLikeOnComment);

export default router;
