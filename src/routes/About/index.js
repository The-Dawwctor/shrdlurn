import React, { Component } from "react"
import { connect } from "react-redux"
import Actions from "actions/logger"
import { Link } from "react-router"
import "./styles.css"
import { DOCUMENTATION_URL } from "constants/strings"

class Information extends Component {
	componentDidMount() {
		this.props.dispatch(Actions.joinCommunity())
	}

	render() {
		return (
			<div className="About">
			<div>
			<p>NRC is a command interface for controlling robots.
			It is an experimental platform for developing techniques
    		    allowing computers to parse a naturalized programming language.
			Our goal is to allow people access
    		    to the power of programming languages
    		    without conforming to their uncompromising syntax.
			NRC does this by learning from its user interactively starting from a precise programming language.
			</p>
        <h2>Get started</h2>
      <ul>
       <li> Go to the <Link to="/build">build page</Link> and type "repeat 3 [add red top]". </li>
       <li>NRC always understands the <a target="_blank" href={DOCUMENTATION_URL}>core language</a>, which has a fixed syntax like other programming languages.</li>
       <li> You can define
      "add red top 3 times" by clicking the "Define this" button and then enter "repeat 3 [add red top]".
      You can now use
      "add green left 5 times". </li>
      <li>Alternatively, you can use the mouse to select to select some previous commands and define them.</li>
      <li>Previous users already defined some concepts and used them to build voxel structures.</li>
       </ul>
				<h2>More...</h2>
        <ul>
        <li><a target="_blank" href={DOCUMENTATION_URL}>Documentation</a>: core language, the setup, etc </li>
        <li><a target="_blank" href="https://github.com/The-Dawwctor/shrdlurn-robot/blob/master/Voxelurn.md#defined-by-users">Examples</a>: actions and structures defined by users</li>
        <li><a target="_blank" href="https://arxiv.org/abs/1704.06956">Our paper</a></li>
        </ul>
        </div></div>
		)
	}
}

const mapStateToProps = (state) => ({
	structs: state.logger.structs,
	utterances: state.logger.utterances,
	topBuilders: state.logger.topBuilders
})

export default connect(mapStateToProps)(Information)
