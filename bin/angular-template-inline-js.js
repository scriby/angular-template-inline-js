#!/usr/bin/env node

var inliner = require('../index');
var fs = require('fs');
var args = process.argv;
var options = {};

// Set defaults
options.basePath = './';
options.outputFile = 'template-inline.js';

// Parse arguments
for (var i = 0; i < args.length; i++) {
    switch (args[i]) {
        case 'node':
            ++i;
            break;
        case '--basePath':
            options.basePath = args[++i];
            break;
        case '--key':
            options.key = args[++i];
            break;
        case '--output-file':
            options.outputFile = args[++i];
            break;
        default:
            if (!options.inputFile) {
                options.inputFile = args[i];
            } else {
                console.error('ERR: Something is wrong with your arguments');
                process.exit(1);
            }
    }
}

// Check pipe for content if input file is not specified
if (!options.inputFile) {
    checkPipe(function (content) {
        generateInlinedFile(content);
    });
} else {
    var content = fs.readFileSync(options.basePath + options.inputFile, {encoding: 'utf-8'});
    generateInlinedFile(content);
}

function checkPipe(successCallback) {
    var data = '';
    var pipeTimeout = setTimeout(function () {
        console.error('ERR: No content specified! Either specify a input file or pipe content to template-inline');
        process.exit(1);
    }, 1000);

    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function () {
        clearTimeout(pipeTimeout);
        chunk = process.stdin.read();
        if (chunk != null) {
            data += chunk;
        }
    });

    process.stdin.on('end', function () {
        successCallback(data);
    });
}

function generateInlinedFile(content) {
    var compiled = inliner.compile(content, options);
    fs.writeFileSync(options.basePath + options.outputFile, compiled, {encoding: 'utf-8'});
    console.log('File %s generated successfully', options.basePath + options.outputFile);
    process.exit();
}
