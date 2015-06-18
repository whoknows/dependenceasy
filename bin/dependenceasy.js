#!/usr/bin/env node

var program = require('commander');
var dependenceasy = require('../index.js');

program
    .version('0.0.1')
    .command('install [package] [version]')
    .description('install all or one specific package(s)')
    .action(actionInstall);

program
    .command('clean')
    .description('clean install directory')
    .action(actionClean);

program.parse(process.argv);

function actionInstall(packageToInstall, version) {
    dependenceasy.createDirIfNotExists(dependenceasy.modulesDir);

    if (packageToInstall) {
        dependenceasy.installSpecificPackage(packageToInstall, version);
    } else {
        dependenceasy.installFromPackageJSON();
    }
}

function actionClean() {
    dependenceasy.removeDirectoryContent(dependenceasy.modulesDir);
}
