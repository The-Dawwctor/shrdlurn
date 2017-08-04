import Constants from "constants/actions"
import { SEMPREquery, parseSEMPRE } from "helpers/sempre"
import Logger from "actions/logger"
import { persistStore } from "redux-persist"
import { getStore } from "../"
import { STATUS } from "constants/strings"

function sendContext(history, current_history_idx, sessionId) {
    let contextCommand = "(:context)"
    if (history.length > 0) {
	const idx = current_history_idx >= 0 && current_history_idx < history.length ? current_history_idx : history.length - 1
	const currentState = history[idx].value
	const prevState = JSON.stringify(JSON.stringify(currentState.map(sendContextType)))
	contextCommand = `(:context ${prevState})`
    }

    const contextCmds = { q: contextCommand, sessionId: sessionId }

    return SEMPREquery(contextCmds)
}

function sendContextType(item) {
    let info = [item.names, item.id, item.x, item.y, item.z, item.rotate, item.color]
    if (item.names.includes("Goal")) {
	info.push(item.order)
    } else if (item.names.includes("OpPoint")) {
	info.push(item.frame)
    }
    return info
}

const Actions = {
  setQuery: (query) => {
    return (dispatch) => {
      dispatch({
        type: Constants.SET_QUERY,
        query
      })
    }
  },

  undo: () => {
    return (dispatch, getState) => {
      const { current_history_idx, history } = getState().world

      const idx = current_history_idx !== 0 ? (current_history_idx >= 0 ? current_history_idx - 1 : history.length - 2) : current_history_idx

      dispatch({
        type: Constants.REVERT,
        idx: idx
      })
    }
  },

  redo: () => {
    return (dispatch, getState) => {
      const { current_history_idx, history } = getState().world

      const idx = current_history_idx !== history.length - 1 ? (current_history_idx >= 0 ? current_history_idx + 1 : -1) : current_history_idx

      dispatch({
        type: Constants.REVERT,
        idx: idx
      })
    }
  },

  setStatus: (status) => {
    return (dispatch) => {
      dispatch({
        type: Constants.SET_STATUS,
        status
      })
    }
  },

  tryQuery: (q) => {
    return (dispatch, getState) => {
      const { sessionId } = getState().user
      const { history, current_history_idx } = getState().world

      dispatch({
        type: Constants.SET_STATUS,
        status: STATUS.LOADING
      })

      return sendContext(history, current_history_idx, sessionId)
        .then((eh) => {
          const query = `(:q ${JSON.stringify(q)})`
          const cmds = { q: query, sessionId: sessionId }

          return SEMPREquery(cmds)
            .then((response) => {
              if (response.lines && response.lines.length > 0) {
                /* Alert any errors in the query */
                alert(response.lines.join("; "))
              }

              const formval = parseSEMPRE(response.candidates)

              if (formval === null || formval === undefined) {
                dispatch(Logger.log({ type: "tryFail", msg: { query: q } }))
                return false
              } else {
                const responses = formval

                dispatch(Logger.log({ type: "try", msg: { query: q, responses: formval.length } }))
                dispatch({
                  type: Constants.TRY_QUERY,
                  responses: responses
                })
                return true
              }
            })
        })
        .catch((e) => {
          console.log("tryQuery error?", e)
          return false
        })
    }
  },

  pushToHistory: (el) => {
    return (dispatch) => {
      dispatch({
        type: Constants.ACCEPT,
        el: el
      })
    }
  },

  accept: (text, selectedResp) => {
    return (dispatch, getState) => {
      const { sessionId } = getState().user
      const { responses } = getState().world

      const selected = responses[selectedResp]

      if (selected.error) {
        alert("Can't accept error response. Accept another response or try different query.")
        dispatch({
          type: Constants.SET_STATUS,
          status: STATUS.TRY
        })
        return
      }

      const query = `(:accept ${JSON.stringify(text)} ${selected.formulas.map(f => JSON.stringify(f)).join(" ")})`
      SEMPREquery({ q: query, sessionId: sessionId }, () => { })

      dispatch(Logger.log({ type: "accept", msg: { query: text, rank: selected.rank, formula: selected.formula } }))

      dispatch({
        type: Constants.ACCEPT,
        el: { ...selected, text }
      })

      return true
    }
  },

  acceptNone: (text) => {
    return (dispatch, getState) => {
      const { sessionId } = getState().user
      const { responses } = getState().world

      const formulas = responses.reduce((acc, r) => acc.concat(r.formulas), [])

      const query = `(:reject ${JSON.stringify(text)} ${formulas.map(f => JSON.stringify(f)).join(" ")})`
      SEMPREquery({ q: query, sessionId: sessionId }, () => { })

      dispatch(Logger.log({ type: "acceptNone", msg: { query: text } }))
    }
  },

  define: (idx) => {
    return (dispatch, getState) => {
      const { sessionId } = getState().user
      const { history, query } = getState().world

      if (idx === history.length - 1) {
        alert("Can't define 1st history item. Need something to define it as.")
        return
      }
      const text = history[idx] !== undefined ? history[idx].text : ""
      const defineAs = text !== "" ? text : query

      const defineHist = history.slice(idx + 1, history.length).map(h => [h.text, h.formula]).filter(h => h.type !== "pin")

      // scope multiline definitions by default
      let mode = ":def"
      if (defineHist.length <= 1) {
        mode = ":def_ret"
      } else if (defineHist.length === history.length - 2) {
        mode = ":def_iso"
      }

      const sempreQuery = `(${mode} "${defineAs}" ${JSON.stringify(JSON.stringify(defineHist))})`

      /* Submit define command */
      SEMPREquery({ q: sempreQuery, sessionId: sessionId })
        .then((r) => {
          if (r.lines && r.lines.length > 0) {
            /* Display errors and quit if errors */
            alert(`Error(s) in definition: ${r.lines.join(", ")}`)
            return
          }

          const { formula: topFormula } = r.candidates[0]

          dispatch(Logger.log({ type: "define", msg: { defineAs: defineAs, idx: idx, length: defineHist.length, formula: topFormula } }))

          dispatch({
            type: Constants.DEFINE,
            text: defineAs,
            idx: idx,
            formula: topFormula
          })
        })
    }
  },

  revert: (idx) => {
    return (dispatch) => {
      dispatch(Logger.log({ type: "revert", msg: { idx: idx } }))

      dispatch({
        type: Constants.REVERT,
        idx: idx
      })
    }
  },

  resetResponses: () => {
    return (dispatch) => {
      dispatch({
        type: Constants.RESET_RESPONSES
      })
    }
  },

  closeDefine: () => {
    return (dispatch) => {
      dispatch(Logger.log({ type: "closeDefine" }))

      dispatch({
        type: Constants.CLOSE_DEFINE
      })
    }
  },

  openDefine: (idx) => {
    return (dispatch, getState) => {
      dispatch(Logger.log({ type: "openDefine", msg: { idx } }))

      dispatch({
        type: Constants.OPEN_DEFINE,
        defineN: idx
      })
    }
  },

  setDefineN: (idx) => {
    return (dispatch) => {
      dispatch({
        type: Constants.SET_DEFINE_N,
        defineN: idx
      })
    }
  },

  setPin: () => {
    return (dispatch) => {
      dispatch({
        type: Constants.SET_PIN
      })
    }
  },

  markPin: (idx) => {
    return (dispatch) => {
      dispatch({
        type: Constants.MARK_PIN,
        idx
      })
    }
  },

  injectPin: (idx) => {
    return (dispatch) => {
      dispatch({
        type: Constants.INJECT_PIN,
        idx
      })
    }
  },

  removePin: (idx) => {
    return (dispatch) => {
      dispatch({
        type: Constants.REMOVE_PIN,
        idx
      })
    }
  },

  removeLast: () => {
    return (dispatch) => {
      dispatch({
        type: Constants.REMOVE_LAST
      })
    }
  },

  clear: () => {
    return (dispatch, getState) => {
      dispatch({
        type: Constants.CLEAR
      })
      persistStore(getStore(), { whitelist: ['world', 'user'] }, () => { }).purge()
    }
  }
}

export default Actions
