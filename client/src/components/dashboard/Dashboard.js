import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      Dashboard Content
      <Link to="/fileUpload">Upload</Link>
    </div>
  );
};

export default Dashboard;
