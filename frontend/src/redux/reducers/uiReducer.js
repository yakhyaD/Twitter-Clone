import { LOADING_UI, CLEAR_ERRORS, SET_ERRORS, SET_FLASH_MSG } from "../type";

const initialState = {
  loading: false,
  errors: {},
  flash_msg: null,
};
const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_UI:
      return {
        ...state,
        loading: true,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: {},
      };
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload,
      };
    case SET_FLASH_MSG:
      return {
        ...state,
        flash_msg: action.payload.msg,
      };
    default:
      return state;
  }
};
export default uiReducer;
