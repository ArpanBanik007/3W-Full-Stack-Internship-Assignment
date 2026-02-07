import { IoMdPhotos } from "react-icons/io";
import { useState } from "react";
import axios from "axios";

function UpperFeedpage() {
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const resetAll = () => {
    setShowModal(false);
    setText("");
    setFile(null);
    setPreview(null);
  };

  const submitPost = async () => {
    if (!text && !file) {
      alert("Write something or add a photo");
      return;
    }

    const formData = new FormData();
    formData.append("description", text);
    if (file) formData.append("postFile", file);

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/v1/posts/", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Post created successfully");
      resetAll();
    } catch (err) {
      alert("Post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* CREATE POST CARD */}
      <div className="container mt-3">
        <div className="card shadow-sm rounded-4">
          <div className="card-body">
            <h6 className="fw-bold mb-3">Create Post</h6>

            <div className="d-flex gap-2 align-items-center mb-3">
              <img
                src="https://www.svgrepo.com/show/452030/avatar-default.svg"
                className="rounded-circle"
                width="42"
                alt="avatar"
              />

              <input
                className="form-control rounded-pill bg-light"
                placeholder="What's on your mind?"
                readOnly
                onClick={() => setShowModal(true)}
              />
            </div>

            <div className="d-flex align-items-center gap-4 text-primary">
              <span
                role="button"
                className="d-flex align-items-center gap-1"
                onClick={() => setShowModal(true)}
              >
                <IoMdPhotos size={20} />
                <span>Photo</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Create Post</h5>
                <button className="btn-close" onClick={resetAll}></button>
              </div>

              <div className="modal-body">
                <textarea
                  className="form-control mb-3"
                  rows="3"
                  placeholder="What's on your mind?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-3"
                  onChange={handleFile}
                />

                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="img-fluid rounded"
                  />
                )}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={resetAll}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  disabled={loading}
                  onClick={submitPost}
                >
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UpperFeedpage;
