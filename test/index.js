var test = require('tape')
var S = require('pull-stream')
var React = require('react')
var ReactDom = require('react-dom')
var toStream = require('../')

test('duplex stream from react component', function (t) {
    var i = 0
    t.plan(4)

    function Elmt (props) {
        if (props.count <= 3) {
            process.nextTick(function () {
                t.equal(props.count, i, 'should subscibe to events')
                props.push(++i)
            })
        }
        return null
    }

    Elmt.defaultProps = {
        count: 0
    }

    var strm = toStream(Elmt)
    S(
        strm,
        S.map(function (n) {
            return { count: n }
        }),
        strm
    )

    var el = document.createElement('div')
    document.body.appendChild(el)
    ReactDom.render(React.createElement(strm.view), el)
})

