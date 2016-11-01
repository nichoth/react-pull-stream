var React = require('react')
var pushable = require('pull-pushable')
var Drain = require('pull-stream/sinks/drain')
var xtend = require('xtend')

function toStream (El) {
    var p = pushable()
    var push = p.push.bind(p)

    // var drain = Drain(function onData (d) {
    //     console.log('data', d)
    // }, function onEnd (err) {
    //     console.log('end', err)
    // })

    var View = React.createClass({
        // componentWillMount: function () {
        //     push('componentWillMount')
        // },
        // componentDidMount: function () {
        //     push('componentDidMount')
        // },
        // componentWillUnmount: function () {
        //     push('componentWillUnmount')
        // },
        render: function () {
            // return <El {...this.props} push={push} />
            return React.createElement(El, xtend(this.props, {
                push: push
            }), null)
        }
    })

    p.view = View
    return p
    // return { source: p, view: View }

    // return {
    //     source: p,
    //     // view: View,
    //     // sink: drain
    // }
}

module.exports = toStream
