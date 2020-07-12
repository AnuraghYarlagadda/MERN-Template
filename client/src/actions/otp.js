import { SET_OTP, REMOVE_OTP } from "./types";
import { v4 as uuid } from "uuid";
import { setAlert } from "./alert";
import { register } from "./auth";
import { clearFormData } from "./formData";
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

export const validateOTPAndRegister = (pin, formData, otp, history) => async (
  dispatch
) => {
  const encryptedPins = otp.map(
    (otp) => otp.pin.email === formData.email && otp.pin.otp
  );
  var isMatch = false;
  try {
    for (const encryptedPin of encryptedPins) {
      console.log(pin.pin);
      isMatch = await bcrypt.compare(pin.pin, encryptedPin);
      if (isMatch) {
        dispatch(register(formData));
        dispatch(clearFormData());
        break;
      }
    }
  } catch (e) {
    console.log(e);
  }
  console.log(isMatch);
  if (!isMatch) dispatch(setAlert("Invalid OTP", "error"));
};
