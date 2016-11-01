var React = require('react')
var xtend = require('xtend')
var S = require('pull-stream/pull')
var Pushable = require('pull-pushable')
var Drain = require('pull-stream/sinks/drain')
var Abortable = require('pull-abortable')
var Notify = require('pull-notify')

function toStream (Elmt) {
    var n = Notify()
    var p = Pushable()

    var listener = n.listen()

    var DrainElmt = React.createClass({
        componentDidMount: function () {
            var self = this
            var drain = Drain(function onEvent (ev) {
                self.setState(ev)
            })
            S( listener, drain )
        },

        componentWillUnmount: function () {
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

    return {
        source: p,
        sink: drain,
        view: DrainElmt
    }
}

module.exports = toStream

