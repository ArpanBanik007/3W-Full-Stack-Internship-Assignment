import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function CommentPage() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  /* ================= FETCH POST ================= */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8001/api/v1/posts/${postId}`,
          { withCredentials: true }
        );
        setPost(res.data?.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [postId]);

  /* ================= FETCH COMMENTS ================= */
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8001/api/v1/comments/post/${postId}`,
          { withCredentials: true }
        );
        setComments(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  /* ================= ADD COMMENT ================= */
  const handleAddComment = async () => {
    if (!content.trim() || sending) return;

    try {
      setSending(true);
      const res = await axios.post(
        `http://localhost:8001/api/v1/comments/post/${postId}`,
        { content },
        { withCredentials: true }
      );

      setComments((prev) => [res.data.data, ...prev]);
      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center mt-5 text-danger">Post not found</div>;
  }

  return (
    <div className="container py-4" style={{ maxWidth: "600px" }}>

      {/* ================= POST PREVIEW ================= */}
      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center gap-2 mb-2">
            <img
              src={post.createdBy?.avatar}
              alt=""
              width={40}
              height={40}
              className="rounded-circle object-fit-cover"
            />
            <div>
              <div className="fw-bold">{post.createdBy?.username}</div>
              <div className="text-muted small">
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          {post.description && (
            <p className="mb-2">{post.description}</p>
          )}

          {post.posturl && (
            <img
              src={post.posturl}
              alt=""
              className="img-fluid rounded"
            />
          )}
        </div>
      </div>

      {/* ================= COMMENTS ================= */}
      <div className="card shadow-sm">
        <div className="card-body">

          <h6 className="fw-bold mb-3">Comments</h6>

          {comments.length === 0 ? (
            <p className="text-muted small">No comments yet</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="mb-3">
                <div className="d-flex gap-2">
                  <img
                    src={c.user?.avatar}
                    alt=""
                    width={32}
                    height={32}
                    className="rounded-circle object-fit-cover"
                  />
                  <div>
                    <div className="fw-semibold small">
                      {c.user?.username}
                    </div>
                    <div className="small text-muted">
                      {c.content}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* ================= COMMENT INPUT ================= */}
          <div className="d-flex gap-2 mt-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              className="btn btn-primary btn-sm"
              disabled={sending}
              onClick={handleAddComment}
            >
              Post
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CommentPage;
