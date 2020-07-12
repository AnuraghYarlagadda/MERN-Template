import { SET_OTP, REMOVE_OTP } from "../actions/types";

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_OTP:
      return [...state, payload];
    case REMOVE_OTP:
      return state.filter((pin) => pin.id !== payload);
    default:
      return state;
  }
}
