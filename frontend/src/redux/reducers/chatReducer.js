import {
  LOADING_CONVERSATION,
  GET_CONVERSATION,
  SET_CONVERSATIONS,
  SEND_MESSAGE,
  START_CONVERSATION
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
    case START_CONVERSATION:
      return {
        ...state,
        conversations: [...state.conversations, action.payload],
        conversation: action.payload,
        loading: false
      }

    case GET_CONVERSATION:
      return {
        ...state,
        conversation: action.payload,
        loading: false
      };
    case SEND_MESSAGE:
      let newConversation = state.conversation;
      newConversation.messages.unshift(action.payload);
      return {
        ...state,
        conversation: newConversation,
      };
    default: {
      return state;
    }
  }
};
export default chatReducer;
