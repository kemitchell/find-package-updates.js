var ChangesStream = require('changes-stream')
var ndjson = require('ndjson')
var normalize = require('normalize-registry-metadata')
var pump = require('pump')
var through2 = require('through2')

var NAME = process.argv[2]
console.log(JSON.stringify({name: NAME}))

pump(
  new ChangesStream({
    db: 'https://replicate.npmjs.com',
    include_docs: true,
    since: process.argv[3] ? parseInt(process.argv[2]) : 0
  }),
  through2.obj(function (chunk, _, done) {
    var seq = chunk.seq
    if (seq % 1000 === 0) {
      this.push({seq: seq})
    }
    if (chunk.doc.name && chunk.doc.name === NAME) {
      normalize(chunk.doc)
      this.push(chunk)
    }
    done()
  }),
  ndjson.stringify(),
  process.stdout
)
