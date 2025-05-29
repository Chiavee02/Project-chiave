// componenti/Bottone.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Bottone = ({ to, children, style = {}, ...rest }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "8px 14px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Bottone;
