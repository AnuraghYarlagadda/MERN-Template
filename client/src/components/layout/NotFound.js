import React, { Fragment } from "react";

const NotFound = () => {
  return (
    <Fragment>
      <div className="text-center">
        {" "}
        <h1>
          <i className="fas fa-exclamation-triangle"></i>Page Not Found
        </h1>
        <h5>Sorry, this page doesnot exists! </h5>
      </div>
    </Fragment>
  );
};

export default NotFound;
