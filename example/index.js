var React = require('react')
var h = React.createElement
var reactDom = require('react-dom')
var S = require('pull-stream')
var toStream = require('../')

function MyView (props) {
    console.log(props)

    function click (n) {
        props.push(n)
    }

    return h('div', {
        className: 'app'
    }, [
        h('h1', { key: 'h' }, props.count),
        h('button', { key: 1, onClick: click.bind(null, 1) }, '1'),
        h('button', { key: 2, onClick: click.bind(null, 2) }, '2'),
        h('button', { key: 3, onClick: click.bind(null, 3) }, '3'),
    ])
}

MyView.defaultProps = { count: 0 }

// duplex stream
var stream = toStream(MyView)

var el = document.createElement('div')
document.body.appendChild(el)
reactDom.render(React.createElement(stream.view), el)

S(
    stream,
    S.map( n => ({ count: n }) ),
    stream
)

