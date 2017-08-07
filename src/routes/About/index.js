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
            <li> NRC always understands the <a target="_blank" href={DOCUMENTATION_URL}>core language</a>, which has a fixed syntax.</li>
            <li> You can define
            "add red top 3 times" by clicking the "Define this" button and entering "repeat 3 [add red top]".
            You can now use
            "add green left 5 times". </li>
            <li>Alternatively, use the mouse to select some previous commands and define them.</li>
            <li><a target="_blank" href={DOCUMENTATION_URL}>Documentation</a>: core language, setup, etc </li>
            </ul>
            </div></div>
            )
        }
    }

    export default Information