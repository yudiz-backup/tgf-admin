import React from "react";
import PropTypes from "prop-types";

function ImagePreview({path}) {
  return  <div className="document-preview-group play-doc-preview">
  {path &&
    (typeof path !==
    "string" ? (
      <div className="document-preview">
        {" "}
        <img
          src={URL.createObjectURL(
            path
          )}
          alt="altImage"
        />{" "}
      </div>
    ) : (
      <div className="document-preview">
        <img
          src={process.env.REACT_APP_AWS_S3_BASE_URL + path}
          alt="altImage"
        />{" "}
      </div>
    ))}
</div>;
}

export default ImagePreview;

ImagePreview.propTypes ={
    path: PropTypes.string
}
