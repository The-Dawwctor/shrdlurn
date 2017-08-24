import React from "react"

import "./styles.css"

const Help = () => (
  <div className="Help">
    <h2>Help</h2>
    <hr/>
    <ul>
      <li>
        <strong>Directions:</strong> [dir]: top, bot, left, right, front, back
        <ul>
          <li>very [dir] of ...</li>
        </ul>
      </li>
      <li>
        <strong>Colors:</strong> [color]: Any CSS colors
      </li>
      <li>
        <strong>Numbers:</strong> [number]: Any natural number
      </li>
      <li>
        <strong>Operators:</strong> has, of, not, and, or, +, -, *, /
      </li>
      <li>
        <strong>Blocks:</strong> all, none, this, previous, origin
      </li>

      <li>
        <strong>Simple actions:</strong> add [color] x y z, move [dir] [number]
      </li>

      <li>
        <strong>Control:</strong> repeat, ;, [ ], &#123; &#125;, if, while, foreach, isolate
      </li>

      <li>
        <strong>Simple examples:</strong>
        <ul>
          <li>add yellow 8 4 2</li>
          <li>move right 3</li>
          <li>select top</li>
          <li>select has color red</li>
          <li>move top 1, move bot 3</li>
        </ul>
      </li>

      <li>
        <strong>More examples:</strong>
        <ul>
          <li>select top of left of this </li>
          <li>select this or top of left of this</li>
          <li>select all and not this</li>
          <li>repeat 3 [add red ; select top]</li>
        </ul>
      </li>

      <li>
        <strong>Advanced:</strong>
        <ul>
          <li> &#123; select left or right; add red &#125; </li>
          <li> isolate [repeat 3 [add red left]] </li>
          <li> if has color red [remove all]</li>
          <li> while has height 0 [select left; add yellow]</li>
          <li> select has row [row of left] </li>
          <li> foreach [remove has row row of this]  </li>
          <li> add red;  &#123; select right; update color color of left &#125;  </li>
        </ul>
      </li>
    </ul>
  </div>
)

export default Help
