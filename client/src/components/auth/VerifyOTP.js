import React, { Fragment, useState } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { verifyEmail } from "../../actions/auth";
import {
  validateOTPAndRegister,
  validateOTPAndResetPassword,
} from "../../actions/otp";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import OTPInput, { ResendOTP } from "otp-input-react";

const renderButton = (buttonProps) => {
  return (
    <Grid container alignItems="center" justify="center" direction="row">
      <Button
        variant="contained"
        color="secondary"
        {...buttonProps}
        style={{ textAlign: "center" }}
      >
        {buttonProps.remainingTime !== 0
          ? `Please wait for ${buttonProps.remainingTime} sec`
          : "Resend"}
      </Button>
    </Grid>
  );
};
const renderTime = () => Fragment;

const VerifyOTP = ({
  validateOTPAndRegister,
  validateOTPAndResetPassword,
  history,
  verifyEmail,
  isAuthenticated,
  loading,
  formData,
  otps,
}) => {
  const [OTP, setOTP] = useState("");
  const [errorMessage, setMessage] = useState("");

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
    return <Redirect to="/" />;
  }

  return (
    <Fragment>
      <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-6 card jumbotron bg-light border-dark">
          <h1 className="my-3">Verify OTP</h1>
          <div className="row">
            <div className="col-sm-9 mt-2">
              {" "}
              <OTPInput
                value={OTP}
                onChange={setOTP}
                autoFocus
                OTPLength={6}
                otpType="number"
                disabled={false}
                secure
              />
            </div>
            <div className="col-sm-3 mt-2 text-center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (OTP.length < 6) {
                    setMessage("Invalid OTP");
                  } else {
                    setMessage("");
                    if (formData.forgot) {
                      validateOTPAndResetPassword(OTP, formData, otps, history);
                    } else {
                      validateOTPAndRegister(OTP, formData, otps);
                    }
                  }
                }}
              >
                Submit
              </Button>
            </div>
          </div>
          <Grid container alignItems="center" justify="center" direction="row">
            <FormControl error={OTP.length < 6}>
              <FormHelperText
                style={{ fontSize: "1.5rem", justifyContent: "center" }}
              >
                {OTP.length < 6 && errorMessage}
              </FormHelperText>
            </FormControl>
          </Grid>
          <hr />
          <div className="text-center">
            <ResendOTP
              maxTime={180}
              renderButton={renderButton}
              renderTime={renderTime}
              onResendClick={() => verifyEmail(formData, history)}
            />
          </div>
          <hr />
        </div>
        <div className="col-sm-3"></div>
      </div>
    </Fragment>
  );
};
VerifyOTP.propTypes = {
  verifyEmail: PropTypes.func.isRequired,
  validateOTPAndRegister: PropTypes.func.isRequired,
  validateOTPAndResetPassword: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  otps: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  formData: state.formData,
  otps: state.otp,
});

export default connect(mapStateToProps, {
  verifyEmail,
  validateOTPAndRegister,
  validateOTPAndResetPassword,
})(withRouter(VerifyOTP));
