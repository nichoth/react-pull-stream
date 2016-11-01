// var toSource = require('./source')
// var toSink = require('./sink')

// module.exports = function toDuplex (Elmt) {
//     var sink = toSink(Elmt)
//     var source = toSource(sink.view)
//     return {
//         source: source,
//         sink: sink,
//         view: source.view
//     }
// }

module.exports = require('./sink')
