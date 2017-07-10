import React, { PropTypes } from "react"
import { Link } from "react-router"
import { connect } from "react-redux"

import "./styles.css"

const Header = ({ query, signedIn, sessionId, email, dispatch }) => (
  <div className="Header">
    <div className="Header-logo">
      <span>NLP Robot Control</span>
      <span className="Header-sublogo">a Stanford Robotics/NLP project</span>
    </div>
    <div className="Header-nav">
      <Link to={{ pathname: "/build", query: query }} activeClassName="active"><div>Build</div></Link>
      <a target="_blank" href="https://github.com/The-Dawwctor/shrdlurn-robot/blob/master/Voxelurn.md#core-language"><div>Reference</div></a>
      <Link to={{ pathname: "/about", query: query }} activeClassName="active"><div>Help</div></Link>
    </div>
  </div>
)

Header.propTypes = {
  /* URL parameters in order to persist the query (e.g ?turkid=AMT_123) across
   * route changes */
  query: PropTypes.object
}

const mapStateToProps = (state) => ({
  sessionId: state.user.sessionId,
  email: state.user.email,
  signedIn: state.user.signedIn
})

export default connect(mapStateToProps)(Header)
