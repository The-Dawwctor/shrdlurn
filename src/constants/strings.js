/* Server URLs */
const DEFAULT_SEMPRE_SERVER_URL = "http://localhost:8410"
const DEFAULT_COMMUNITY_SERVER_URL = "http://localhost:8403"
export const SEMPRE_SERVER_URL = process.env.REACT_APP_SEMPRE_SERVER ? process.env.REACT_APP_SEMPRE_SERVER : DEFAULT_SEMPRE_SERVER_URL
export const COMMUNITY_SERVER_URL = process.env.REACT_APP_COMMUNITY_SERVER ? process.env.REACT_APP_COMMUNITY_SERVER : DEFAULT_COMMUNITY_SERVER_URL

/* Header URLs */
export const DOCUMENTATION_URL = "https://github.com/The-Dawwctor/shrdlurn-robot/blob/master/Voxelurn.md"

/* Meta information */
export const DEFAULT_SESSIONID = "deadbeef"

/* Control strings */
export const STATUS = {
  TRY: "TRY",
  ACCEPT: "ACCEPT",
  DEFINE: "DEFINE",
  LOADING: "LOADING"
}

/* Important Variables */
export const CUBE_MINIMUM = 50

/* Display Strings */
export const COMMAND_BAR_PLACEHOLDER = "Tell the robot to do something..."
export const COMMAND_BAR_DEFINE_PLACEHOLDER = "Define this set of actions as..."
export const TRY_MSG = "Enter a command for the robot."
export const ACCEPT_MSG = "Click accept if the robot correctly intepreted what you meant, scroll to see other intepretations, or revise your command."
export const DEFINE_MSG = "Define the highlighted set of actions as this phrase (e.g. pick up the blue box)."
export const DEFINE_THIS = "Define This"
export const FINISH_DEFINITION = "Finish Definition"
