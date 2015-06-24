var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var fs = require('fs');
var _ = require('lodash');

var modulesDir = process.cwd() + '/dependenceasy_modules';

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
    console.log('Install from package.json');

    _.each(getDependenciesFromPackageJSON(), function (version, github) {
        installSpecificPackage(github, version);
    });
}

function installSpecificPackage(packageToInstall, version) {
    var moduleDir = modulesDir + '/' + packageToInstall.match(/\/([\w\d-]*)\.git/)[1];

    if (createDirIfNotExists(moduleDir)) {
        //removeDirectoryContent(moduleDir);
        execSync('rm -rf ' + moduleDir + '/*');
    }

    var cmd = getCommandDependingOnRequiredVersion(version) + ' ' + packageToInstall + ' ' + moduleDir;

    console.log(cmd);

    exec(cmd, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('git clone error: ' + error);
        }
        installRecurciveDependencies(moduleDir);
    });
}

function installRecurciveDependencies(moduleDir) {
    fs.readdirSync(moduleDir, function (err, files) {
        _.each(files, function (file) {
            console.log(file);
        });
    });
}

/********************************************************/
/****************** Utility functions *******************/
/********************************************************/

function getCommandDependingOnRequiredVersion(version) {
    if (version) {
        return 'git clone -b ' + version + ' --single-branch';
    }

    return 'git clone';
}

function removeDirectoryContent(dir) {
    execSync('rm -rf ' + dir + '/*');
}

function createDirIfNotExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);

        return false;
    }

    return true;
}

module.exports = {
    modulesDir: modulesDir,
    getDependenciesFromPackageJSON: getDependenciesFromPackageJSON,
    installFromPackageJSON: installFromPackageJSON,
    installSpecificPackage: installSpecificPackage,
    installRecurciveDependencies: installRecurciveDependencies,
    getCommandDependingOnRequiredVersion: getCommandDependingOnRequiredVersion,
    removeDirectoryContent: removeDirectoryContent,
    createDirIfNotExists: createDirIfNotExists
};
