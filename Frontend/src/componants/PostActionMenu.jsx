import { useEffect, useRef } from "react";
import { FaRegBookmark } from "react-icons/fa6";
import { FaUserAltSlash } from "react-icons/fa";

const PostActionMenu = ({ isOpen, onClose, onSave, onBlock }) => {
  const menuRef = useRef(null);

  // 🔹 বাইরে ক্লিক করলে menu বন্ধ
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="position-absolute top-100 end-0 mt-2 bg-dark text-white
                 rounded shadow p-2 z-3"
      style={{ width: "180px" }}
    >
      {/* SAVE */}
      <button
        className="btn btn-dark w-100 d-flex align-items-center gap-2 text-start"
        onClick={() => {
          onSave();
          onClose();
        }}
      >
        <FaRegBookmark />
        <span>Save</span>
      </button>

      <hr className="border-secondary my-1" />

      {/* BLOCK */}
      <button
        className="btn btn-dark w-100 d-flex align-items-center gap-2 text-start text-danger"
        onClick={() => {
          onBlock();
          onClose();
        }}
      >
        <FaUserAltSlash />
        <span>Block</span>
      </button>
    </div>
  );
};

export default PostActionMenu;
