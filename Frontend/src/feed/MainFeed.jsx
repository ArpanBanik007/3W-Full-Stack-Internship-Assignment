import { useEffect, useState } from "react";
import api from "../utils/axios";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaComment } from "react-icons/fa";
import { FaShareNodes } from "react-icons/fa6";
import { PiDotsThreeBold } from "react-icons/pi";

import { useSelector, useDispatch } from "react-redux";
import FollowButton from "../componants/FollowButton";
import { fetchMyFollowings } from "../slices/follow.slice";
import PostActionMenu from "../componants/PostActionMenu";

function MainFeed() {
  const dispatch = useDispatch();
  const { mydetails, loading: userLoading } = useSelector(
    (state) => state.mydetails,
  );

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  /* ================= FETCH FOLLOWINGS ================= */
  useEffect(() => {
    dispatch(fetchMyFollowings());
  }, [dispatch]);

  /* ================= FETCH FEED ================= */
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get("/api/v1/posts/feed");
        setPosts(res.data?.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setFeedLoading(false);
      }
    };
    fetchFeed();
  }, []);

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!posts.length) return;

    posts.forEach((post) => socket.emit("join-post", post._id));

    const handleReactionUpdate = (data) => {
      setPosts((prev) =>
        prev.map((post) =>
          post._id === data.postId
            ? { ...post, likes: data.likes, userLiked: data.userLiked }
            : post,
        ),
      );
    };

    socket.on("post-reaction-updated", handleReactionUpdate);
    return () => socket.off("post-reaction-updated", handleReactionUpdate);
  }, [posts]);

  useEffect(() => {
    const handleCommentCountUpdate = ({ postId, commentsCount }) => {
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, commentsCount } : post,
        ),
      );
    };

    socket.on("comment-count-updated", handleCommentCountUpdate);
    return () => socket.off("comment-count-updated", handleCommentCountUpdate);
  }, []);

  /* ================= LIKE ================= */
  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/api/v1/posts/${postId}/like`);
      const liked = res.data?.liked;

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, userLiked: liked } : post,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOADING ================= */
  if (feedLoading || userLoading) {
    return (
      <div className="text-center py-5 text-secondary fs-5">
        Loading posts...
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="container mt-4">
      <div className="d-flex flex-column align-items-center gap-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="card shadow-sm w-100"
            style={{
              maxWidth: "620px",
              backgroundColor: "#f3f4f6",
              borderRadius: "14px",
            }}
          >
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-start p-3">
              <div className="d-flex gap-3">
                <img
                  src={
                    post?.createdBy?.avatar ||
                    "https://www.svgrepo.com/show/452030/avatar-default.svg"
                  }
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <div>
                  <div className="fw-bold fs-5">{post.createdBy.fullName}</div>
                  <div className="fw-bold">@{post.createdBy.username}</div>
                  <div className="text-muted small">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                {post.createdBy._id !== mydetails?._id && (
                  <FollowButton
                    userId={post.createdBy._id}
                    isFollowedByBackend={post.createdBy.isFollowedByMe}
                  />
                )}

                <PiDotsThreeBold
                  size={22}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setOpenMenuId(openMenuId === post._id ? null : post._id)
                  }
                />
              </div>

              <PostActionMenu
                isOpen={openMenuId === post._id}
                onClose={() => setOpenMenuId(null)}
              />
            </div>

            {/* CONTENT */}
            <div className="px-3 pb-3">
              {post.description && <p>{post.description}</p>}
              {post.posturl && (
                <img
                  src={post.posturl}
                  className="w-100 rounded"
                  style={{ maxHeight: "340px", objectFit: "contain" }}
                />
              )}
            </div>

            {/* ACTIONS */}
            <div className="border-top d-flex justify-content-around py-2">
              <button
                className={`btn btn-link ${
                  post.userLiked ? "text-danger" : "text-dark"
                }`}
                onClick={() => handleLike(post._id)}
              >
                <FaHeart /> {post.likes}
              </button>

              <button onClick={() => navigate(`/post/${post._id}`)}>
                <FaComment /> {post.commentsCount || 0}
              </button>

              <button className="btn btn-link text-dark">
                <FaShareNodes /> Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainFeed;
