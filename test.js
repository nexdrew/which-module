import test from 'ava'
import whichModule from './'
import path from 'path'

test('finds required local module', (t) => {
  const indexModule = whichModule(whichModule)
  const expectedFilename = path.join(__dirname, 'index.js')
  t.is(indexModule.id, expectedFilename)
  t.is(indexModule.filename, expectedFilename)
  t.is(indexModule.exports, whichModule)
  t.is(indexModule.parent, module)
  t.is(indexModule.loaded, true)
  t.is(indexModule.paths[0], path.join(__dirname, 'node_modules'))
})

test('finds required dependency module', (t) => {
  const avaModule = whichModule(test)
  const expectedFilename = path.join(__dirname, 'node_modules', 'ava', 'index.js')
  t.is(avaModule.id, expectedFilename)
  t.is(avaModule.filename, expectedFilename)
  t.is(avaModule.exports, test)
  t.is(avaModule.parent, module)
  t.is(avaModule.loaded, true)
  t.is(avaModule.paths[0], path.join(__dirname, 'node_modules', 'ava', 'node_modules'))
  t.truthy(avaModule.children.length)
})

test('returns falsy for system module', (t) => {
  t.falsy(whichModule(path))
  t.falsy(whichModule(require('fs')))
})

test('returns falsy for non-required', (t) => {
  // note that a module may export a boolean (e.g. supports-color)
  t.falsy(whichModule(t))
  t.falsy(whichModule({}))
  t.falsy(whichModule(function () {}))
  t.falsy(whichModule('foobar'))
  t.falsy(whichModule(String))
  t.falsy(whichModule())
})
