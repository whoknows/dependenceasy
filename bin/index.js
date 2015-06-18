#!/usr/bin/env node

var program = require('commander');
var exec = require('child_process').exec;
var fs = require('fs');
var _ = require('lodash');

var modulesDir = process.cwd() + '/dependenceasy_modules';

program
    .version('0.0.1')
    .command('install [package] [version]')
    .description('install all or one specific package(s)')
    .action(function (packageToInstall, version) {
        createDirIfNotExists(modulesDir);

        if (packageToInstall) {
            installSpecificPackage(packageToInstall, version);
        } else {
            console.log('Install from package.json');
            installFromPackageJSON();
        }
    });

program.parse(process.argv);

function getDependenciesFromPackageJSON() {
    var packageJSON = require(process.cwd() + '/package.json');
    var dependencies = _.get(packageJSON, 'dependenceasy.dependencies');

    if (dependencies) {
        return dependencies;
    } else {
        return {};
    }
}

function installFromPackageJSON() {
    _.each(getDependenciesFromPackageJSON(), function (version, github) {
        installSpecificPackage(github, version);
    });
}

function installSpecificPackage(packageToInstall, version) {
    var moduleDir = modulesDir + '/' + packageToInstall.match(/\/([A-Za-z0-9]*)\.git/)[1];
    createDirIfNotExists(moduleDir);

    exec('git clone ' + packageToInstall + ' ' + moduleDir, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('git clone error: ' + error);
        }
    });
}

function createDirIfNotExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}
