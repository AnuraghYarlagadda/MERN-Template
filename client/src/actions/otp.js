import { SET_OTP, REMOVE_OTP } from "./types";
import { v4 as uuid } from "uuid";
import { setAlert } from "./alert";
import { register } from "./auth";
const bcrypt = require("bcryptjs");

export const setOTP = (pin, timeout = 180000) => (dispatch) => {
  const id = uuid();
  dispatch({
    type: SET_OTP,
    payload: {
      pin,
      id,
    },
  });
  setTimeout(
    () =>
      dispatch({
        type: REMOVE_OTP,
        payload: id,
      }),
    timeout
  );
};

export const validateOTPAndRegister = (pin, formData, otps) => async (
  dispatch
) => {
  const encryptedPins = otps.map(
    (otp) => otp.pin.email === formData.email && otp.pin.otp
  );
  var isMatch = false;
  try {
    for (const encryptedPin of encryptedPins) {
      isMatch = await bcrypt.compare(pin, encryptedPin);
      if (isMatch) {
        dispatch(register(formData));
        break;
      }
    }
  } catch (e) {
    console.log(e);
  }
  if (!isMatch) dispatch(setAlert("Invalid OTP", "error"));
};
