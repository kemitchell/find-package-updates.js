var ChangesStream = require('changes-stream')
var normalize = require('normalize-registry-metadata')
var pump = require('pump')
var through2 = require('through2')

var NAME = process.argv[2]

pump(
  new ChangesStream({
    db: 'https://replicate.npmjs.com',
    include_docs: true,
    since: process.argv[3] ? parseInt(process.argv[2]) : 0
  }),
  through2.obj(function (chunk, _, done) {
    if (!chunk.name || !chunk.versions) {
      done()
    } else {
      var name = chunk.doc.name
      if (name !== NAME) {
        done()
      } else {
        normalize(chunk.doc)
        done(null, JSON.stringify(chunk))
      }
    }
  }),
  process.stdout
)
