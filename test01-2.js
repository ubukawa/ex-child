const config = require('config')
const Parser = require ('json-text-sequence').parser
const { spawn } = require('child_process')

const minzoom = config.get('minzoom')
const maxzoom = config.get('maxzoom')
const srcs = config.get('srcs')
const ogr2ogrPath = config.get('ogr2ogrPath')


//const downstream = process.stdout

for (const src of srcs) {
  const parser = new Parser()
    .on('data', f => {
      delete f.geometry
      f.tippecanoe = {
        layer: src.layer,
        minzoom: src.minzoom,
        maxzoom: src.maxzoom
      }
      console.log(JSON.stringify(f, null, 2))
    })
  const ogr2ogr = spawn(ogr2ogrPath, [
    '-f', 'GeoJSONSeq',
    '-lco', 'RS=YES',
    '/vsistdout/',
    src.url
  ])
  ogr2ogr.stdout.pipe(parser)
}
