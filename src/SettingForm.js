import React from "react";

import AudioForm from "./AudioForm";

const capitalize = function(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function AudioUpload({ type }) {
  return (
    <AudioForm
      title={`Update your ${type} audio`}
      recorderMargin="none"
      extraInputs={
        <input name={`set${capitalize(type)}`} type="hidden" value="1" />
      }
      alert={{
        severity: "success",
        message: `Your ${type} audio was updated successfully.`,
      }}
    />
  );
}
