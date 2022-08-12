import React, { useState, useEffect } from "react";

const Image = (props) => {
  const [imageSrc, setSetImageSrc] = useState("");

  useEffect(() => {
    const reader = new FileReader();
    reader.readAsDataURL(props.blob);
    reader.onloadend = function () {
      setSetImageSrc(reader.result);
    };
  }, [props.blob]);

  return (
    <img
      style={{ width: 100, height: "auto" }}
      src={imageSrc}
      alt={props.fileName}
    />
  );
};

export default Image;
