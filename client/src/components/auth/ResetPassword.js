import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import IconButton from "@material-ui/core/IconButton";
import { resetPassword } from "../../actions/auth";

const lowercaseRegex = /(?=.*[a-z])/;
const uppercaseRegex = /(?=.*[A-Z])/;
const numericRegex = /(?=.*[0-9])/;
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
const ResetPassword = ({
  history,
  loading,
  isAuthenticated,
  formData,
  resetPassword,
}) => {
  const formik = useFormik({
    initialValues: { password: "", confirm_password: "" },
    validationSchema: Yup.object({
      password: Yup.string()
        .matches(lowercaseRegex, "One lowercase required!")
        .matches(uppercaseRegex, "One uppercase required!")
        .matches(numericRegex, "One number required!")
        .min(8, "Minimum 8 characters")
        .required("Required!"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Password's do not match")
        .required("Required!"),
    }),
    onSubmit: (values) => {
      resetPassword(formData, values, history);
    },
  });
  const classes = useStyles();
  const [password, togglePassword] = useState(false);
  const [confirm_password, toggleConfirmPassword] = useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  //If Loading Show Spinner
  if (loading) {
    return (
      <div className="text-center">
        <CircularProgress size="5rem" color="secondary" />
      </div>
    );
  }
  //Redirect if formData is empty
  else if (JSON.stringify(formData) === "{}") {
    return <Redirect to="/login" />;
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
          <h1>Reset Account Password</h1>
          <hr />
          <form onSubmit={formik.handleSubmit}>
            <FormControl
              className={classes.margin}
              fullWidth
              error={formik.errors.password && formik.touched.password}
            >
              <InputLabel htmlFor="password">New Password</InputLabel>
              <Input
                autoComplete="nope"
                id="password"
                name="password"
                type={password ? "text" : "password"}
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => togglePassword(!password)}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {!password ? (
                        <MdVisibility
                          size="1.5rem"
                          style={{ color: "#40bf45" }}
                        />
                      ) : (
                        <MdVisibilityOff
                          size="1.5rem"
                          style={{ color: "#de1212" }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText id="component-error-text">
                {formik.errors.password &&
                  formik.touched.password &&
                  formik.errors.password}
              </FormHelperText>
            </FormControl>

            <FormControl
              className={classes.margin}
              fullWidth
              error={
                formik.errors.confirm_password &&
                formik.touched.confirm_password
              }
            >
              <InputLabel htmlFor="confirm_password">
                Confirm Password
              </InputLabel>
              <Input
                autoComplete="nope"
                id="confirm_password"
                name="confirm_password"
                type={confirm_password ? "text" : "password"}
                value={formik.values.confirm_password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => toggleConfirmPassword(!confirm_password)}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {!confirm_password ? (
                        <MdVisibility
                          size="1.5rem"
                          style={{ color: "#40bf45" }}
                        />
                      ) : (
                        <MdVisibilityOff
                          size="1.5rem"
                          style={{ color: "#de1212" }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText id="component-error-text">
                {formik.errors.confirm_password &&
                  formik.touched.confirm_password &&
                  formik.errors.confirm_password}
              </FormHelperText>
            </FormControl>

            <div className="text-center">
              <button type="submit" className="btn btn-danger">
                Reset
              </button>
            </div>
          </form>
          <hr />
        </div>
        <div className="col-sm-3"></div>
      </div>
    </Fragment>
  );
};

ResetPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  formData: state.formData,
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapStateToProps, { resetPassword })(
  withRouter(ResetPassword)
);
