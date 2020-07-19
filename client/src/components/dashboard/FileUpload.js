import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useState } from "react";
import api from "../../utils/api";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  // Handling file selection from input
  const onFileSelected = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Uploading image to Cloud Storage
  const handleFileUpload = async (e) => {
    e.preventDefault();
    try {
      if (selectedFile !== "") {
        // Creating a FormData object
        let fileData = new FormData();

        // Adding the 'file' field and the selected file as value to our FormData object
        // Changing file name to make it unique and avoid potential later overrides
        fileData.set(
          "file",
          selectedFile,
          `${Date.now()}-${selectedFile.name}`
        );
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(percentCompleted);
          },
        };
        const res = await api.post("/file", fileData, config);
        console.log(res.data.path);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={(e) => handleFileUpload(e)}>
      <input type="file" onChange={onFileSelected} />
      <input type="submit"></input>
    </form>
  );
};

export default FileUpload;
