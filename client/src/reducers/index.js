import { combineReducers } from "redux";
import auth from "./auth";
import alert from "./alert";
import otp from "./otp";
import formData from "./formData";

export default combineReducers({
  alert,
  otp,
  auth,
  formData,
});
