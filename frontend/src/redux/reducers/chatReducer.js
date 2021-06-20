import {
  LOADING_CONVERSATION,
  GET_CONVERSATION,
  SET_CONVERSATIONS,
} from "../type";

const initialState = {
  conversations: null,
  conversation: null,
  loading: false,
};
const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_CONVERSATION:
      return {
        ...state,
        loading: true,
      };
    case SET_CONVERSATIONS: {
      return {
        ...state,
        conversations: action.payload.conversations,
        loading: false,
      };
    }
    case GET_CONVERSATION:
      return {
        ...state,
        conversation: action.payload,
      };
    default: {
      return state;
    }
  }
};
export default chatReducer;
