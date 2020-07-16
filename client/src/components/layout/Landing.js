import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

const Landing = ({ isAuthenticated, loading }) => {
  const classes = useStyles();
  //If Loading Show Spinner
  if (loading) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    );
  } else if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return <div>Project Overview</div>;
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
