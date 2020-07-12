import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";

import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { register, verifyEmail } from "../../actions/auth";
import { validateOTPAndRegister } from "../../actions/otp";
import PropTypes from "prop-types";

import { useFormik } from "formik";
import * as Yup from "yup";

const numericRegex = /(?=^[0-9]*$)/;

const VerifyOTP = ({
  setAlert,
  register,
  validateOTPAndRegister,
  history,
  verifyEmail,
  isAuthenticated,
  formData,
  otp,
}) => {
  const formik = useFormik({
    initialValues: { pin: "" },
    validationSchema: Yup.object({
      pin: Yup.string()
        .matches(numericRegex, "Invalid!")
        .min(6, "Invalid!")
        .max(6, "Invalid!")
        .required("Required!"),
    }),
    onSubmit: (values) => {
      validateOTPAndRegister(values, formData, otp, history);
    },
  });

  // Redirect if logged-in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1>Verify OTP</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="pin">OTP</label>
          <input
            type="pin"
            name="pin"
            value={formik.values.pin}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          {formik.errors.pin && formik.touched.pin && (
            <p>{formik.errors.pin}</p>
          )}
        </div>
        <div>
          <input type="submit" value="submit" />
        </div>
      </form>
      <button onClick={() => verifyEmail(formData, history)}>resend</button>
    </Fragment>
  );
};
VerifyOTP.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  verifyEmail: PropTypes.func.isRequired,
  validateOTPAndRegister: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  otp: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  formData: state.formData,
  otp: state.otp,
});

export default connect(mapStateToProps, {
  setAlert,
  register,
  verifyEmail,
  validateOTPAndRegister,
})(VerifyOTP);
