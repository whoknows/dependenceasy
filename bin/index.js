#!/usr/bin/env node

var program = require('commander');
var _ = require('lodash');
/*
var exec = require('child_process').exec;
var child = exec('ls -a | grep ' + searchPattern, function (err, stdout, stderr) {
    console.log(stdout);
});
*/

function getDependenciesFromPackageJSON() {
    var packageJSON = require('../package.json');
    var dependencies = _.get(packageJSON, 'dependenceasy.dependencies');

    if (dependencies) {
        return dependencies;
    } else {
        return {};
        console.log("Dependenceasy > dependencies not found in package.json");
    }
}

function installFromPackageJSON() {
    _.each(getDependenciesFromPackageJSON(), function (version, github) {
        installSpecificPackage(github, version);
    });
}

function installSpecificPackage(packageToInstall, version) {
    console.log(' => ', packageToInstall, version);
}

program
    .version('0.0.1')
    .command('install [package] [version]')
    .description('install all or one specific package(s)')
    .action(function (packageToInstall, version) {
        if (packageToInstall) {
            installSpecificPackage(packageToInstall, version);
        } else {
            console.log('Install from package.json');
            installFromPackageJSON();
        }
    });

program.parse(process.argv);
