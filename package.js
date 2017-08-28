Package.describe({
  name: 'herteby:denormalize',
  version: '0.8.0',
  summary: 'Provides simple methods for common denormalization tasks',
  git: 'https://github.com/herteby/meteor-denormalize.git',
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.0')

  //Required core packages
  api.use(['ecmascript'])
  api.use([
    'check',
    'mongo',
    'ejson',
    'matb33:collection-hooks@0.8.4'
  ], 'server')

  Npm.depends({
    "lodash": "4.17.4"
  })

  //Weak 3rd party packages
  api.use([
    'aldeed:collection2@2.0.0',
  ], {where: 'server', weak: true})

  api.addFiles('denormalize-common.js')
  api.addFiles('denormalize-hooks.js', 'server')
  api.addFiles('methods/cacheDoc.js', 'server')
  api.addFiles('methods/cacheCount.js', 'server')
  api.addFiles('methods/cacheField.js', 'server')
  api.export(['Denormalize'])
})

Package.onTest(function(api) {
  api.use('herteby:denormalize')
  api.use(['ecmascript', 'tinytest'])
  api.use([
    'check',
    'mongo',
    'ejson',
    'matb33:collection-hooks@0.8.4',
    'aldeed:collection2@2.0.0',
  ], 'server')
  Npm.depends({
    "lodash": "4.17.4"
  })

  api.export(['Posts', 'Comments', 'Denormalize'])

  api.addFiles('tests.js', 'server')
})
