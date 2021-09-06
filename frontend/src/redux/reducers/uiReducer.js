import { LOADING_UI, CLEAR_ERRORS, SET_ERRORS, SET_FLASH_MSG, STOP_LOADER, FLASH_MESSAGE, OPEN_STARTING_CHAT } from "../type";

const initialState = {
  loading: false,
  errors: null,
  flash_msg: null,
  openChatModal: false,
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
        errors: null,
        loading: setTimeout(() => { return false }, 1500)
      };

    case SET_ERRORS:
      setTimeout(() => {
        return {
        ...state,
        errors: null,
        loading: false,
      };
      }, 2500);
      return {
        ...state,
        errors: action.payload,
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
    case FLASH_MESSAGE:
      setTimeout(() => {
        return {
          ...state,
           flash_msg: null,
        }
      },1000);
      return {
        ...state,
        flash_msg: action.payload,
      };
    case OPEN_STARTING_CHAT:
      return{
        ...state,
        openChatModal: !state.openChatModal
      }
    default:
      return state;
  }
};
export default uiReducer;
