import React, { Component } from "react"
import { Link } from "react-router"
import "./styles.css"
import { DOCUMENTATION_URL } from "constants/strings"

class Information extends Component {
    render() {
        return (
            <div className="About">
            <div>
            <p>NRC is a command interface for controlling robots.
            It's an experimental platform for developing techniques
            allowing computers to parse naturalized programming languages.
            Our goal is to allow people access to the power of programming languages
            without conforming to uncompromising syntax.
            NRC does this by interactively learning from its user starting from a precise programming language.
            </p>
            <h2>Get started</h2>
            <ul>
            <li> Go to the <Link to="/build">build page</Link> and type "add red 1 4 5" </li>
            <li> NRC always understands the <a target="_blank" href={DOCUMENTATION_URL}>core language</a>, which has a fixed syntax.</li>
            <li> You can define
            "add ball 1 4 5" by clicking the "Define this" button and entering "add red 1 4 5".
            You can now use
            "add ball 2 3 4". </li>
            <li>Alternatively, use the mouse to select some previous commands and define them.</li>
            <li>Use the "send" command to send all the typed commands to the server.</li>
            <li><a target="_blank" href={DOCUMENTATION_URL}>Documentation</a>: core language, setup, etc </li>
            </ul>
            </div></div>
            )
        }
    }

    export default Information