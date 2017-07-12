import io from "socket.io-client"
import Constants from "constants/actions"
import { COMMUNITY_SERVER_URL } from "constants/strings"
import { setStore, getStore, genSid } from "helpers/util"

function sendSocket(getState, event, payload) {
  let socket = getState().logger.socket
  let uid = getState().user.sessionId

  const token = getStore("auth_token", "")

  const message = { ...payload, uid: uid, token: token }

  return new Promise((resolve, reject) => {
    if (socket && socket.connected && typeof socket.emit === "function") {
      socket.emit(event, message)
      resolve(socket)
    } else {
      // Retry
      setTimeout(() => {
        socket = getState().logger.socket
        if (socket && socket.connected && typeof socket.emit === "function") {
          socket.emit(event, message)
          resolve(socket)
        } else {
          setTimeout(() => {
            socket = getState().logger.socket
            if (socket && socket.connected && typeof socket.emit === "function") {
              socket.emit(event, message)
              resolve(socket)
            } else {
              setTimeout(() => {
                socket = getState().logger.socket
                if (socket && socket.connected && typeof socket.emit === "function") {
                  socket.emit(event, message)
                  resolve(socket)
                } else {
                  console.log("send socket failed retry, error?")
                  reject("retry failed")
                }
              }, 3000)
            }
          }, 1000)
        }
      }, 500)
    }
  })
}

const Actions = {
  open: () => {
    return (dispatch, getState) => {
      const { sessionId } = getState().user

      const socket = io(COMMUNITY_SERVER_URL)
      socket.on("connect", () => {
        console.log("logging socket connected")

        sendSocket(getState, "session", { "sessionId": sessionId })

        sendSocket(getState, "getscore", {})

        sendSocket(getState, "getstructcount", {})

        /* Query for a new score every 45 seconds */
        setInterval(() => sendSocket(getState, "getscore", {}), 45000)

        dispatch({
          type: Constants.OPEN_LOGGING_SOCKET,
          socket: socket
        })
      })

      socket.on("definitions", (e) => {
        const definitions = {}
        for (const definition of e.definitions)
          definitions[definition.symbol] = definition

        dispatch({
          type: Constants.LOAD_DEFINITIONS,
          definitions
        })
      })
    }
  },

  setStructureId: (e) => {
    return (dispatch, getState) => {
      /* Set structure Id */
      const routing = getState().routing

      let structureId = ""
      const location = routing.location || routing.locationBeforeTransitions
      const sidParam = location.query.sid

      if (sidParam) {
        structureId = sidParam
      } else {
        let sid = getStore("sid")
        if (!sid) {
          sid = genSid()
          setStore("sid", sid)
        }
        structureId = sid
      }

      dispatch({
        type: Constants.SET_STRUCTURE_ID,
        sid: structureId
      })
    }
  },

  changeStructureId: (sid) => {
    return (dispatch) => {
      setStore("sid", sid)
      dispatch({
        type: Constants.SET_STRUCTURE_ID,
        sid: sid
      })
    }
  },

  log: (e) => {
    return (dispatch, getState) => {
      const payload = { type: e.type, msg: e.msg }

      sendSocket(getState, "log", payload)
    }
  },

  getUser: () => {
    return (dispatch, getState) => {
      let { token } = getState().user

      if (!token) {
        /* Check localStorage because reduxPersist's rehydration is not
         * guaranteed to have finished when this function is called */
        const userStorage = getStore("reduxPersist:user")
        if (userStorage.token)
          token = userStorage.token
      }

      if (token)
        sendSocket(getState, "get_user", { token })
    }
  },

  getDefinitions: () => {
    return (dispatch, getState) => {
      sendSocket(getState, "get_definitions")
    }
  }
}

export default Actions
