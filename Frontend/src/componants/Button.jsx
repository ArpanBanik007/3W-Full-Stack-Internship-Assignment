const Button = ({
  text,
  onClick,
  disabled,
  type = "button",
  loading = false,
  className = "",
  variant = "primary", // bootstrap style control
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} w-100 fw-bold ${
        loading ? "disabled" : ""
      } ${className}`}
    >
      {loading ? "Processing..." : text}
    </button>
  );
};

export default Button;
