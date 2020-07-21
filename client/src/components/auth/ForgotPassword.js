import React, { Fragment } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { verifyEmail } from "../../actions/auth";
import { setFormData } from "../../actions/formData";
import PropTypes from "prop-types";

import { useFormik } from "formik";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { AiOutlineMail } from "react-icons/ai";
import { BsFillShieldLockFill } from "react-icons/bs";

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
const ForgotPassword = ({
  setFormData,
  verifyEmail,
  history,
  isAuthenticated,
  loading,
}) => {
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid E-mail format").required("Required!"),
    }),
    onSubmit: (values) => {
      values["forgot"] = true;
      setFormData(values);
      verifyEmail(values, history);
    },
  });
  const classes = useStyles();

  //If Loading Show Spinner
  if (loading) {
    return (
      <div className="text-center">
        <CircularProgress size="5rem" color="secondary" />
      </div>
    );
  }

  // Redirect if logged-in
  else if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-6 card jumbotron bg-light border-dark">
          <h1>Forgot Password</h1>
          <p>
            <BsFillShieldLockFill size="1.5rem" /> Verify your Email to reset
            the Password!
          </p>
          <hr />
          <form onSubmit={formik.handleSubmit}>
            <FormControl
              className={classes.margin}
              fullWidth
              error={formik.errors.email && formik.touched.email}
            >
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                name="email"
                label="email"
                type="email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="start">
                    <AiOutlineMail size="1.5rem" style={{ color: "#d00205" }} />
                  </InputAdornment>
                }
              />
              <FormHelperText id="component-error-text">
                {formik.errors.email &&
                  formik.touched.email &&
                  formik.errors.email}
              </FormHelperText>
            </FormControl>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Verify Email
              </button>
            </div>
          </form>
          <hr />
          <h6>
            Already have an account? <Link to="/login">Sign In</Link>
          </h6>
        </div>
        <div className="col-sm-3"></div>
      </div>
    </Fragment>
  );
};
ForgotPassword.propTypes = {
  setFormData: PropTypes.func.isRequired,
  verifyEmail: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapStateToProps, { setFormData, verifyEmail })(
  withRouter(ForgotPassword)
);
