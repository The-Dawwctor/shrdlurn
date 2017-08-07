/* Server URLs */
const DEFAULT_SEMPRE_SERVER_URL = "http://localhost:8410"
export const SEMPRE_SERVER_URL = process.env.REACT_APP_SEMPRE_SERVER ? process.env.REACT_APP_SEMPRE_SERVER : DEFAULT_SEMPRE_SERVER_URL

/* Header URLs */
export const DOCUMENTATION_URL = "https://github.com/The-Dawwctor/shrdlurn-robot/blob/master/NRC.md"

/* Meta information */
export const DEFAULT_SESSIONID = "deadbeef"

/* Control strings */
export const STATUS = {
  TRY: "TRY",
  ACCEPT: "ACCEPT",
  DEFINE: "DEFINE",
  LOADING: "LOADING"
}

/* Display Strings */
export const COMMAND_BAR_PLACEHOLDER = "Tell robot to do something..."
export const COMMAND_BAR_DEFINE_PLACEHOLDER = "Define these actions as..."
export const TRY_MSG = "Enter command for robot."
export const ACCEPT_MSG = "Click accept if robot correctly intepreted you, scroll to see other intepretations, or revise your command."
export const DEFINE_MSG = "Define highlighted set of actions as this phrase."
export const DEFINE_THIS = "Define This"
export const FINISH_DEFINITION = "Finish Definition"
