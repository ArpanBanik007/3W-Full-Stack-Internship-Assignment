const InputField = ({
  label,
  type = "text",
  name,
  value,
  placeholder,
  onChange,
}) => {
  return (
    <div className="mb-3">
      {label && <label className="form-label fw-semibold">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="form-control"
      />
    </div>
  );
};

export default InputField;
