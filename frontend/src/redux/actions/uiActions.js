import { OPEN_STARTING_CHAT } from "../type"

export const startChat = () => (dispatch) => {
    dispatch({type: OPEN_STARTING_CHAT })
}
