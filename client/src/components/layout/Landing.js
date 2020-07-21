import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";

const Landing = ({ isAuthenticated, loading }) => {
  //If Loading Show Spinner
  if (loading) {
    return (
      <div className="text-center">
        <CircularProgress size="5rem" color="secondary" />
      </div>
    );
  } else if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div>
      <div className="text-center">
        <h1>Project Overview</h1>
      </div>
    </div>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapStateToProps)(Landing);
