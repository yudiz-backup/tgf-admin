import React from "react";
import PropTypes from "prop-types";
import { Editor } from "@tinymce/tinymce-react";

function EditorHtml({ htmlData, setHtmlData }) {
  return (
    <Editor
      onEditorChange={(e) => {
        setHtmlData(e);
      }}
      value={htmlData || ""}
      // initialValue={defaultContent}
      apiKey="cvqsnu51iw19dgecqrlk6v77xt2kpx5k2kezh0wqdt2uxm84"
      init={{
        height: 500,
        menubar: "file view insert tools format table",
        browser_spellcheck: true,
        toolbar:
          "undo redo | blocks | bold italic blockquote underline | bullist numlist outdent indent ",
        plugins:
          "lists link code preview charmap  media wordcount anchor fullscreen autolink  autosave  codesample directionality emoticons  help hr image  importcss insertdatetime  nonbreaking noneditable pagebreak paste print quickbars searchreplace tabfocus template textpattern visualblocks visualchars table",
        branding: false,
        toolbar_mode: "wrap",
      }}
    />
  );
}

export default EditorHtml;

EditorHtml.propTypes = {
  htmlData: PropTypes.string,
  setHtmlData: PropTypes.func,
};
