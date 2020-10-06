/* eslint-disable no-console */
const path = require('path');
const colorette = require('colorette');
const fs = require('fs');
const shell = require('shelljs');
const crypto = require('crypto');

const pkgOk = require('./pkg-ok.js');
const esCheck = require('./es-check.js');
const pkgCanInstall = require('./pkg-can-install.js');
const promiseSpawn = require('./promise-spawn.js');

const os = require('os');
const CHECK_MARK = colorette.green('✔');
const CROSS_MARK = colorette.red('✘');
const SKIP_MARK = colorette.yellow('→');

const verify = function(options) {
  const log = (...args) => options.verbose && !options.quiet && console.log.apply(null, args);
  const error = (...args) => !options.quiet && console.error.apply(null, args);

  if (!options.dir || !fs.existsSync(options.dir) || !fs.existsSync(path.join(options.dir, 'package.json'))) {
    error('You must pass/run in/with a directory that exists with a package.json');
    return Promise.resolve(1);
  }

  let exitCode = 0;

  const useResult = function(result) {
    if (result.status !== 0) {
      exitCode = 1;
      error(`${CROSS_MARK} - ${result.text}`);
    } else {
      log(`${CHECK_MARK} - ${result.text}`);
    }
  };

  const WORKING_DIR = path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex'));

  shell.mkdir('-p', WORKING_DIR);

  return Promise.resolve().then(function() {
    return promiseSpawn('npm', ['pack', '--json', '--dry-run'], {cwd: options.dir});
  }).then(function(result) {
    if (result.status !== 0) {
      error('npm pack failed!', result.out);
      return Promise.resolve(1);
    }

    const packOutput = JSON.parse(result.stdout);

    return Promise.all(packOutput.map((output) => {
      return Promise.all(output.files.map((file) => Promise.resolve().then(function() {
        const dirname = path.dirname(file.path);

        if (dirname) {
          shell.mkdir('-p', path.join(WORKING_DIR, dirname));
        }

        shell.cp(file.path, path.join(WORKING_DIR, file.path));

        return Promise.resolve();
      })));
    }));
  }).then(function() {
    const promises = [
      pkgCanInstall(WORKING_DIR).then(useResult),
      pkgOk(WORKING_DIR).then(useResult)
    ];

    if (!options.skipEsCheck) {
      promises.push(esCheck(WORKING_DIR).then(useResult));
    } else {
      log(`${SKIP_MARK} - ${esCheck.text}`);
    }

    return Promise.all(promises);
  }).then(function(results) {
    return Promise.resolve(exitCode);
  }).catch(function(e) {
    error('vjsverify: An internal error occurred', e);
    return Promise.resolve(1);
  });
};

module.exports = verify;
