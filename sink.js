var React = require('react')
var xtend = require('xtend')
var S = require('pull-stream/pull')
var Pushable = require('pull-pushable')
var Drain = require('pull-stream/sinks/drain')
var Abortable = require('pull-abortable')
var Notify = require('pull-notify')

function toSink (Elmt) {
    var n = Notify()
    var p = Pushable()

    var sub = n.listen()

    var DrainElmt = React.createClass({
        componentDidMount: function () {
            var self = this
            var drain = Drain(function onEvent (ev) {
                self.setState(ev)
            })
            S( sub, drain )
        },

        componentWillUnmount: function () {
            // sub.abort()
        },

        render: function () {
            return React.createElement(Elmt, xtend(this.props, this.state, {
                push: p.push.bind(p)
            }), null)
        }
    })

    var abortable = Abortable()
    var drain = S(
        abortable,
        Drain(function onEvent (ev) {
            n(ev)
        }, function onEnd (err) {
        })
    )
    drain.abort = abortable.abort.bind(abortable)
    // drain.view = DrainElmt

    return {
        source: p,
        sink: drain,
        view: DrainElmt
    }
}

module.exports = toSink

