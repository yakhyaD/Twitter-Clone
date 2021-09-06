import {
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER,
  LOADING_USER,
  LIKE_TWEET,
  UNLIKE_TWEET,
  SET_PROFILE,
  FOLLOW_USER,
  UPDATE_PROFILE,
  SET_BOOKMARKS,
  GET_BOOKMARKS,
  SET_FOLLOW_SUGGESTION,
  LOADING_SUGGESTION,
  SET_TRENDS,
  LOADING_TREND,
  SEARCH_USER_RESULTS,
  SEARCH_TREND_RESULTS,
  IGNORE_USER,
  SET_ERRORS,
} from "../type";

const initialState = {
  authenticated: false,
  loading: false,
  user: null,
  profile: null,
  bookmarks: [],
  suggestionsFollowers: [],
  loadingSuggestions: false,
  loadingTrend: false,
  trends: [],
  searchUserResult: null,
  searchTrendResult: null,
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
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
    case SET_UNAUTHENTICATED:
      return {
        initialState,
      };
    case SET_USER:
      return {
        loading: false,
        authenticated: true,
        ...action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case LOADING_SUGGESTION:
      return {
        ...state,
        loadingSuggestions: true,
      };
    case LOADING_TREND:
      return {
        ...state,
        loadingTrend: true,
      };
    case LIKE_TWEET:
      let newUser = state.user;
      console.log(action.payload);
      newUser.likes.push(action.payload);

      return {
        ...state,
        user: {
          ...state.user,
          ...newUser,
        },
      };
    case UNLIKE_TWEET:
      let newUser2 = state.user;
      state.user.likes = newUser2.likes.filter(
        (like) => like !== action.payload
      );
      return {
        ...state,
        user: {
          ...state.user,
          ...newUser2,
        },
      };

    case SET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false,
      };
    case FOLLOW_USER: {
      let newProfile = state.profile;
      let newUser = state.user;
      if (action.payload.msg === "User Unfollowed") {
        newProfile.followers = state.profile.followers.filter(
          (id) => id === action.data
        );
        newUser.following = state.user.following.filter(
          (id) => id === action.data
        );
      } else if (action.payload.msg === "User Followed") {
        newProfile.followers.unshift(action.data);
        newUser.following.unshift(action.data);
      }
      return {
        ...state,
        profile: {
          ...state.profile,
          ...newProfile,
        },
        user: {
          ...state.user,
          ...newUser,
        },
        loading: false,
      };
    }
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.data,
        },
        loading: false,
      };
    case SET_BOOKMARKS:
      let updatedUser = state.user;
      let tweetId = action.data;
      let msg = action.payload.msg;
      if (msg.includes("removed")) {
        updatedUser.bookmarks = state.user.booksmarks.filter(
          (id) => id !== tweetId
        );
      } else if (msg.includes("added")) {
        updatedUser.booksmarks.unshift(tweetId);
      }
      return {
        ...state,
        user: updatedUser,
      };
    case GET_BOOKMARKS:
      return {
        ...state,
        bookmarks: action.payload,
        loading: false,
      };
    case SET_FOLLOW_SUGGESTION:
      return {
        ...state,
        suggestionsFollowers: action.payload.filter(person => person._id !== state.user._id),
        loadingSuggestions: false,
      };
    case SET_TRENDS:
      return {
        ...state,
        trends: action.payload,
        loadingTrend: false,
      };
    case SEARCH_USER_RESULTS:
      return {
        ...state,
        searchUserResult: action.payload,
        loading: false,
      };
    case SEARCH_TREND_RESULTS:
      return {
        ...state,
        searchTrendResult: action.payload,
        loading: false,
      };
    case IGNORE_USER:
      return {
        ...state,
        suggestionsFollowers: state.suggestionsFollowers.filter(user => user === action.payload)
      }
    default:
      return state;
  }
};
export default userReducer;
