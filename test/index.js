var test = require('tape')
var Pushable = require('pull-pushable')
var S = require('pull-stream')
var React = require('react')
var ReactDom = require('react-dom')
var toStream = require('../')


test('pass in a source', function (t) {
    t.plan(2)

    function Elmt (props) {
        process.nextTick(function () {
            props.push(1)
        })
        return null
    }
    Elmt.defaultProps = {
        count: 0
    }

    var source = Pushable()
    var viewStream = toStream(Elmt, source)

    S(
        viewStream.source,
        S.map(function (ev) {
            return { count: ev }
        }),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [
                { count: 1 }
            ], 'should emit events')
        })
    )

    var el = document.createElement('div')
    document.body.appendChild(el)
    ReactDom.render(React.createElement(viewStream.view), el)

    process.nextTick(source.end)
})


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

