var exec = require('child_process').exec;
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
    var moduleDir = modulesDir + '/' + packageToInstall.match(/\/([A-Za-z0-9]*)\.git/)[1];

    if (createDirIfNotExists(moduleDir)) {
        removeDirectoryContent(moduleDir);
    }

    var cmd = getCommandDependingOnRequiredVersion(version) + ' ' + packageToInstall + ' ' + moduleDir;

    console.log(cmd);

    exec(cmd, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('git clone error: ' + error);
        }
    });
}

function installRecurciveDependencies() {
    //
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
    exec('rm -rf ' + dir + '/*', function (error, stdout, stderr) {
        if (error !== null) {
            console.log('git clone error: ' + error);
        }
    });
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
