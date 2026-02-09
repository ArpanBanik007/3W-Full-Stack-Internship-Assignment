import { Router } from "express";
import { verifyJWT } from "../middlewire/auth.middlewire.js";
import {
  createPostComment,
  getAllCommentsForPost,
  getRepliesByCommentIdForPost,
} from "../controller/post.comments.controller.js";

const router = Router();

router.post("/post/:postId", verifyJWT, createPostComment);
router.get("/post/:postId", getAllCommentsForPost);
router.get("/:commentId/replies", getRepliesByCommentIdForPost);

export default router;
