var React = require('react')
var h = React.createElement
var reactDom = require('react-dom')
var toStream = require('../')
// var toSource = require('../source')
// var toSink = require('../sink')
var S = require('pull-stream')

function MyView (props) {
    // var ns = [1,2,3]
    // ns.forEach(n => process.nextTick(() => props.push(n)))
    // console.log('props', props)

    console.log(props)
    function click (n) {
        props.push(n)
    }

    return h('div', {
        className: 'app'
    }, [
        h('button', { key: 1, onClick: click.bind(null, 1) }, '1'),
        h('button', { key: 2, onClick: click.bind(null, 2) }, '2'),
        h('button', { key: 3, onClick: click.bind(null, 3) }, '3'),
    ])
}

var stream = toStream(MyView)
// var source = toSource(MyView)
// var sink = toSink(MyView)

var el = document.createElement('div')
document.body.appendChild(el)
reactDom.render(React.createElement(stream.view), el)

S(
    stream,
    S.map( n => ({ count: n }) ),
    stream
)

