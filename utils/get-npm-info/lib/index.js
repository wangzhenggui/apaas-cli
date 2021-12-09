'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

function getNpmInfo(npmName, registry) {
    if (!npmName) return;
    const newRegistry = registry || 'https://registry.npmjs.org/'
    const npmInfoUrl = urlJoin(newRegistry, npmName)
    console.log('npmInfoUrl', npmInfoUrl )
}

module.exports = {
    getNpmInfo
}