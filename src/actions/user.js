import Constants from "constants/actions"
import { getStore, setStore, genUid } from "helpers/util"

const Actions = {
  setSessionId: () => {
    return (dispatch, getState) => {
      /* Session ID is either (in order of priority) UID stored in localStorage
       * or newly generated UID stored in localStorage. */
      let sessionId = ""

      let uid = getStore("uid")
      if (!uid) {
        uid = genUid()
        setStore("uid", uid)
      }
      sessionId = uid

      dispatch({
        type: Constants.SET_SESSION_ID,
        sessionId: sessionId
      })
    }
  }
}

export default Actions
