#!/usr/bin/env node

const exec = require('child_process').exec;
const fs   = require('fs');

const cwd = process.cwd();

//
// Run plugin unit tests separately (w/o istanbul).
//
const baseDir = `${cwd}/plugins`;

fs.readdir(baseDir, (err, files) => {
  files.forEach(name => {
    const pluginDir=`${baseDir}/${name}`;

    const cmd = `INIT_CWD="${pluginDir}" "${cwd}/node_modules/.bin/mocha" --require "${cwd}/mocha.env.js" "${pluginDir}/test/unit.js"`;

    exec(cmd, (error, stdout, stderr) => {
      if (stderr && !/Authorization attempt/.test(stderr)) {
        throw new Error(stderr);
      }

      console.log(stdout);
    });
  });
});
