import React, { Component, PropTypes } from 'react'
import Actions from "actions/world"
import LoggerActions from "actions/logger"
import { connect } from "react-redux"
import Mousetrap from "mousetrap"
import History from "containers/History"
import Setting, { diff } from "setting"
import CommandBar from "containers/CommandBar"
import { STATUS } from "constants/strings"
import StatusMsg from "components/StatusMsg"
import WorldActions from "actions/world"

import "./styles.css"

class Build extends Component {
    static propTypes = {
	/* Injected by Redux */
	status: PropTypes.string,
	historyLen: PropTypes.number,
	responses: PropTypes.array,
	dispatch: PropTypes.func,
    }

    constructor(props) {
	super(props)

	this.state = { selectedResp: 0, possSteps: 33, wivn: false }
    }

    componentDidMount() {
	/* Bind Ctrl+Z and Crtl+Shift+Z to Undo and Redo actions respectively */
	Mousetrap.prototype.stopCallback = () => false;
	Mousetrap.bind("command+z", (e) => { e.preventDefault(); this.props.dispatch(Actions.undo()) })
	Mousetrap.bind("command+shift+z", (e) => { e.preventDefault(); this.props.dispatch(Actions.redo()) })

	this.props.dispatch(LoggerActions.setStructureId())
    }

    componentDidUpdate(prevProps) {
	/* Whenever there is a status change, reset the selected response */
	if (prevProps.status !== this.props.status)
	    this.setState({ selectedResp: 0 })
    }

    componentWillUnmount() {
	/* Clean up the key undo+redo bindings */
	Mousetrap.unbind("command+z")
	Mousetrap.unbind("command+shift+z")
    }

    handleQuery(query) {
	switch (this.props.status) {
	case STATUS.TRY:
            /* Try the query */
            this.props.dispatch(Actions.tryQuery(query))
		.then(r => {
		    if (!r) {
			/* The try query was unsuccessful, so set it as a pin */
			this.props.dispatch(Actions.setPin())
			this.props.dispatch(Actions.resetResponses())
			this.props.dispatch(Actions.setQuery(""))
			this.setState({ selectedResp: 0 })
		    } else {
			/* Try query successful! Give the user a choice */
			this.setState({ selectedResp: 0 })
		    }
		})
            break
	case STATUS.ACCEPT:
            const r = this.props.dispatch(Actions.accept(query, this.state.selectedResp))
            if (r)
		this.setState({ selectedResp: 0 })
            break
	case STATUS.DEFINE:
            this.props.dispatch(Actions.define(this.props.defineN))
            break
	case STATUS.LOADING:
            this.props.dispatch(Actions.setStatus(STATUS.TRY))
            break
	default:
            console.log("uh oh... unknown status!", this.props.status)
            break
	}
    }

    upSelected() {
	const selectedResp = this.state.selectedResp
	if (selectedResp < this.props.responses.length - 1) {
	    this.setState({ selectedResp: selectedResp + 1 })
	    this.props.dispatch(LoggerActions.log({ type: "scroll", msg: { dir: "up" } }))
	}
    }

    downSelected() {
	const selectedResp = this.state.selectedResp
	if (selectedResp > 0) {
	    this.setState({ selectedResp: selectedResp - 1 })
	    this.props.dispatch(LoggerActions.log({ type: "scroll", msg: { dir: "down" } }))
	}
    }

    clear() {
	this.props.dispatch(WorldActions.clear())
    }
    
    closeDefine() {
	this.props.dispatch(Actions.closeDefine())
    }

    handleShiftClick() {
	// TODO: open up latest define
	// const { history, defining } = this.props.world
	// if (defining) return
	// /* Find last pin to define */
	// const idx = history.slice().reverse().findIndex(h => h.type === "pin")
	// if (idx !== -1) {
	//   this.props.dispatch(Actions.define(history.length - 1 - idx))
	// } else {
	//   alert("shift-enter is for defining, you are not in defining mode")
	// }
    }

    render() {
	const { status, responses, history, current_history_idx} = this.props

	/* Current state should be  history element at  last position, or
	 * one selected by current_history_idx */
	let idx = current_history_idx >= 0 ? current_history_idx : history.length - 1
	if (idx > history.length - 1) idx = history.length - 1
	let currentState = history[idx].value

	if (status === STATUS.ACCEPT && !responses[this.state.selectedResp].error) {
	    /* If the status is accept, then the current state will be the diff
	     * of the previous state and the responded state */
	    currentState = diff(currentState, responses[this.state.selectedResp].value)
	}

	return (
		<div className="Build">
		<div className="Build-world">
		<Setting blocks={currentState} width={1650} height={1200} isoConfig={{ canvasWidth: 1650, canvasHeight: 1200, numUnits: 40 }} />
		</div>
		<div className="Build-command">
		<History />
		<CommandBar
            onClick={(query) => this.handleQuery(query)}
            handleShiftClick={() => this.handleShiftClick()}
            onUp={() => this.upSelected()}
            onDown={() => this.downSelected()} />
		<div className="Build-status">
		<StatusMsg status={status} />
		<div className="Build-actions">
		{status === STATUS.ACCEPT &&
                 <div>
                 <span>{this.state.selectedResp + 1} / {responses.length} possible interpretations</span>
                 <div className="Build-actions-buttons">
                 <button onClick={() => this.downSelected()}>&uarr;</button>
                 <button onClick={() => this.upSelected()}>&darr;</button>
                 </div>
                 </div>
		}
            </div>
		</div>
		<div>
		<button onClick={() => this.clear()}>Clear</button>
		</div>
		</div>
		</div>
	);
    }
}

const mapStateToProps = (state) => ({
    status: state.world.status,
    historyLen: state.world.history.length,
    history: state.world.history,
    responses: state.world.responses,
    defineN: state.world.defineN,
    current_history_idx: state.world.current_history_idx
})

export default connect(mapStateToProps)(Build)
