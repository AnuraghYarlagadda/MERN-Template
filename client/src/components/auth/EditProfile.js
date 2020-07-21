import React, { Fragment, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editProfile, deleteAccount } from "../../actions/auth";

import {
  MdVisibility,
  MdVisibilityOff,
  MdAccountCircle,
  MdDeleteForever,
} from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import IconButton from "@material-ui/core/IconButton";
import Swal from "sweetalert2/dist/sweetalert2.all.min.js";
import "sweetalert2/src/sweetalert2.scss";
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
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-danger m-2",
    cancelButton: "btn btn-success m-2",
  },
  buttonsStyling: false,
});
const EditProfile = ({ editProfile, history, deleteAccount }) => {
  const formik = useFormik({
    initialValues: { password: "", name: "" },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(5, "Minimum 5 Characters")
        .max(12, "Maximum 12 Characters")
        .required("Required!"),
      password: Yup.string().required("Required!"),
    }),
    onSubmit: (values) => {
      editProfile(values, history);
    },
  });
  const classes = useStyles();
  const [password, togglePassword] = useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <Fragment>
      <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-6 card jumbotron bg-light border-dark">
          <h1>Edit Profile</h1>
          <hr />
          <form onSubmit={formik.handleSubmit}>
            <FormControl
              className={classes.margin}
              fullWidth
              error={formik.errors.password && formik.touched.password}
            >
              <InputLabel htmlFor="password">Check Password</InputLabel>
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
              error={formik.errors.name && formik.touched.name}
            >
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                id="name"
                name="name"
                label="Name"
                type="text"
                value={formik.values.name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="start">
                    <MdAccountCircle
                      size="1.5rem"
                      style={{ color: "#1273de" }}
                    />
                  </InputAdornment>
                }
              />
              <FormHelperText id="component-error-text">
                {formik.errors.name &&
                  formik.touched.name &&
                  formik.errors.name}
              </FormHelperText>
            </FormControl>

            <div className="text-center">
              <button type="submit" className="btn btn-danger">
                Submit
              </button>
            </div>
          </form>
          <hr />
          <div className="row text-center">
            <h5 className="text-center">
              Delete My Account
              <IconButton
                onMouseDown={handleMouseDownPassword}
                onClick={() =>
                  swalWithBootstrapButtons
                    .fire({
                      title: "Are you sure?",
                      text: "You won't be able to revert this!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes, delete it!",
                      cancelButtonText: "No, cancel!",
                      reverseButtons: true,
                    })
                    .then((result) => {
                      if (result.value) {
                        deleteAccount();
                      }
                    })
                }
              >
                <MdDeleteForever size="1.5rem" style={{ color: "#d00205" }} />
              </IconButton>
            </h5>
          </div>
          <hr />
        </div>
        <div className="col-sm-3"></div>
      </div>
    </Fragment>
  );
};

EditProfile.propTypes = {
  editProfile: PropTypes.func.isRequired,
};

export default connect(null, { editProfile, deleteAccount })(
  withRouter(EditProfile)
);
