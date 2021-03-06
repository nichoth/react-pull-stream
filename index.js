var React = require('react')
var xtend = require('xtend')
var S = require('pull-stream/pull')
var Pushable = require('pull-pushable')
var Drain = require('pull-stream/sinks/drain')
var Abortable = require('pull-abortable')
var Notify = require('pull-notify')

function ReactStream (Elmt, onEnd) {
    var notify = Notify()
    var sourceNotify = Notify()
    var pushable = Pushable()

    var source = S(
        pushable,
        S.through(sourceNotify)
    )
    source.listen = sourceNotify.listen
    source.end = pushable.end

    var listener = notify.listen()

    var DrainElmt = React.createClass({
        componentWillMount: function () {
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
        }, function _onEnd (err) {
            if (err) throw err
            pushable.end(err)
            sourceNotify.end(err)
            if (onEnd) onEnd(err)
        })
    )

    return {
        source: source,
        sink: drain,
        view: DrainElmt,
        abort: abortable.abort.bind(abortable)
    }
}

module.exports = ReactStream

