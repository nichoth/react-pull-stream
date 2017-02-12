var React = require('react')
var xtend = require('xtend')
var S = require('pull-stream/pull')
var Pushable = require('pull-pushable')
var Drain = require('pull-stream/sinks/drain')
var Abortable = require('pull-abortable')
var Notify = require('pull-notify')

function ReactStream (Elmt, _pushable) {
    var notify = Notify()
    var pushable = _pushable || Pushable()

    var listener = notify.listen()

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
            var props = xtend(this.props, this.state, {
                push: pushable.push
            })
            return React.createElement(Elmt, props, null)
        }
    })

    var abortable = Abortable()
    var drain = S(
        abortable,
        Drain(function onEvent (ev) {
            notify(ev)
        }, function onEnd (err) {
            // @TODO
            console.log('end', err)
        })
    )
    drain.abort = abortable.abort.bind(abortable)

    return {
        source: pushable,
        sink: drain,
        view: DrainElmt
    }
}

module.exports = ReactStream

