import Constants from "constants/actions"
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

  getDefinitions: () => {
    return (dispatch, getState) => {
      sendSocket(getState, "get_definitions")
    }
  }
}

export default Actions
