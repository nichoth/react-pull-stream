var React = require('react')
var reactDom = require('react-dom')
var toStream = require('../')
var S = require('pull-stream')

function MyView (props) {
    var ns = [1,2,3]
    ns.forEach(n => process.nextTick(() => props.push(n)))

    return React.createElement('div', {
        className: 'app'
    }, 'my view')
}

var stream = toStream(MyView)
S( stream.source, S.log() )

reactDom.render(React.createElement(stream.view), document.body)
