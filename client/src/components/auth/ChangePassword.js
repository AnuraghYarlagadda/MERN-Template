import React, { Fragment, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { changePassword } from "../../actions/auth";

import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import IconButton from "@material-ui/core/IconButton";

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

const ChangePassword = ({ changePassword, history }) => {
  const formik = useFormik({
    initialValues: { current_password: "", password: "", confirm_password: "" },
    validationSchema: Yup.object({
      current_password: Yup.string().required("Required!"),
      password: Yup.string()
        .matches(lowercaseRegex, "one lowercase required!")
        .matches(uppercaseRegex, "one uppercase required!")
        .matches(numericRegex, "one number required!")
        .min(8, "Minimum 8 characters")
        .required("Required!"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Password's do not match")
        .required("Required!"),
    }),
    onSubmit: (values) => {
      changePassword(values, history);
    },
  });
  const classes = useStyles();
  const [current_password, toggleCurrentPassword] = useState(false);
  const [password, togglePassword] = useState(false);
  const [confirm_password, toggleConfirmPassword] = useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Fragment>
      <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-6 jumbotron bg-light">
          <h1>Reset Account Password</h1>
          <hr />
          <form onSubmit={formik.handleSubmit}>
            <FormControl
              className={classes.margin}
              fullWidth
              error={
                formik.errors.current_password &&
                formik.touched.current_password
              }
            >
              <InputLabel htmlFor="current_password">
                Current Password
              </InputLabel>
              <Input
                autoComplete="nope"
                id="current_password"
                name="current_password"
                type={current_password ? "text" : "password"}
                value={formik.values.current_password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => toggleCurrentPassword(!current_password)}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {!current_password ? (
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
                {formik.errors.current_password &&
                  formik.touched.current_password &&
                  formik.errors.current_password}
              </FormHelperText>
            </FormControl>

            <FormControl
              className={classes.margin}
              fullWidth
              error={formik.errors.password && formik.touched.password}
            >
              <InputLabel htmlFor="password">Password</InputLabel>
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

ChangePassword.propTypes = {
  changePassword: PropTypes.func.isRequired,
};

export default connect(null, { changePassword })(withRouter(ChangePassword));
