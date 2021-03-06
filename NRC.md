# Natural Robot Control (NRC)

(TODO: Change once details of NRC implementation are designed/programmed so this isn't an obsolete Voxelurn.md)

## Core language
The system always understands a core language, which is just a programming language designed to interpolate well with natural language.

Directions:
`top, bot, left, right, front, back`

Extreme directions: `very top, very bot, very left ...`

Colors:
`red, orange, yellow, green, blue, white, black, pink, brown`, and any [css colors](https://www.w3schools.com/cssref/css_colors.asp)

Operators:
`has, of, not, and, or, +, -`

Sets: `all, none, this, previous, origin`

Primitive actions:
`select, add, remove, move`

Control flow: `repeat, ;, [], {}, if, while, foreach, isolate`

### Examples
```
add red top
add yellow
repeat 3 [add yellow top]
select top
select has color red
move left; move bot
```

```
repeat 3 add red top
select top of left of this
select this or top of left of this
select all and not this
repeat 3 [add red; select top]
```

### Advanced

```
{select left or right; add red};
isolate [repeat 3 [add red left]]
if has color red [remove all]
while has height 0 [select left; add yellow]
select has row [row of left]
foreach [remove has row row of this]  
add red;  {select right; update color color of left}
```

## About

NRC is a command interface for controlling robots.
It is an experimental platform for developing techniques
allowing computers to parse a naturalized programming language.
Our goal is to allow people access
to the power of programming languages
without conforming to their uncompromising syntax.
NRC does this by learning from its user community interactively starting from a precise programming language.

For technical details:
* the grammars of the [core language](https://github.com/The-Dawwctor/sempre-robot/blob/master/interactive/dal.grammar) and the [NRC specific language](https://github.com/The-Dawwctor/sempre-robot/blob/master/interactive/robot.grammar)
* the [server side code](https://github.com/The-Dawwctor/sempre-robot)
