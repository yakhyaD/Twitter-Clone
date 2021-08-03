import { LOADING_UI, CLEAR_ERRORS, SET_ERRORS, SET_FLASH_MSG, STOP_LOADER } from "../type";

const initialState = {
  loading: false,
  errors: [],
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
        errors: [...state.errors, action.payload],
        loading: false,
      };
    case SET_FLASH_MSG:
      return {
        ...state,
        flash_msg: action.payload.msg,
      };
    case STOP_LOADER:
      return {
        ...state,
        loading: false,
    };
    default:
      return state;
  }
};
export default uiReducer;
