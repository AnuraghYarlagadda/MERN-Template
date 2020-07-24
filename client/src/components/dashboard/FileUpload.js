import CircularProgressWithLabel from "../ui/CircularProgressWithLabel";
import React, { useState, Fragment } from "react";
import api from "../../utils/api";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(null);
  const [progress, setProgress] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
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
        setProgress(0);
        setLoading(true);
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
            setProgress(percentCompleted);
          },
        };
        const res = await api.post("/file", fileData, config);
        if (res.data) {
          setLoading(false);
          setProgress(0);
          setDownloadUrl(res.data.downloadUrl);
        }
      }
    } catch (error) {
      setLoading(null);
      setProgress(null);
      setDownloadUrl(null);
      console.log(error.message);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-6 text-center mt-3">
        <form onSubmit={(e) => handleFileUpload(e)}>
          <input type="file" onChange={onFileSelected} />
          <input type="submit" className="btn btn-primary"></input>
        </form>
        <hr className="bg-dark" />
        <Fragment>
          {loading && <CircularProgressWithLabel value={progress} />}
        </Fragment>
        <Fragment>
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <button>
                <i className="fas fa-download" />
                Download File
              </button>
            </a>
          )}
        </Fragment>
      </div>
      <div className="col-lg-6 text-center p-2">
        <img
          src={
            downloadUrl ||
            "https://advance.einstein.edu/wp-content/uploads/cropped-placeholder.jpg"
          }
          width="250"
          height="250"
          alt="anu"
        />
      </div>
    </div>
  );
};

export default FileUpload;
