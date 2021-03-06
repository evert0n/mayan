'use strict'

const context = require('./context')
const buildBackend = require('./backend/build')
const buildFrontend = require('./frontend/build')
const deployBackend = require('./backend/deploy')
const deployFrontend = require('./frontend/deploy')
const runSequential = require('./util').runSequential
const kleur = require('kleur')

function createDeploy(argv) {
  let onError = (err) => {
    console.log(kleur.red(err.message))
  }

  return context({ ...argv }).then(ctx => {
    const promises = []

    // Allow the build process to be skipped.
    if (!argv['skip-build']) {
      if (argv.frontend || !argv.backend) {
        promises.push(buildFrontend)
      }

      if (argv.backend || !argv.frontend) {
        promises.push(buildBackend)
      }
    }

    if (argv.frontend || !argv.backend) {
      promises.push(deployFrontend)
    }

    if (argv.backend || !argv.frontend) {
      promises.push(deployBackend)
    }

    return runSequential(promises, ctx, argv)
  }).catch(onError)
}

module.exports = createDeploy
