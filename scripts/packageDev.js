"use strict";
var exec = require("child_process").exec;
var command = 'tfx extension create --manifest-globs vss-extension.json --overrides-file ../configs/dev.json --no-prompt --json';

exec(command, {
    "cwd": "./dist"
}, (error, stdout) => {
    if (error) {
        console.error(`Could not create package: '${error}'`);
        return;
    }

    let output = JSON.parse(stdout);
    console.log(`Package created ${output.path}`);
});
