/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var babel = require('babel-core');
var assign = require('object-assign');
var babelOpts = require('../babel/default-options');
var babelInlineRequires = require('fbjs-scripts/babel/inline-requires');
var createCacheKeyFunction = require('fbjs-scripts/jest/createCacheKeyFunction');
var path = require('path');

// Modify babelOpts to account for our needs. Namely we want to retain line
// numbers for better stack traces in tests.
babelOpts.retainLines = true;
babelOpts._moduleMap = assign(babelOpts._moduleMap, {
  ReactTestUtils: 'react/lib/ReactTestUtils',
  reactComponentExpect: 'react/lib/reactComponentExpect',
});
babelOpts.plugins.push({
  position: 'after',
  transformer: babelInlineRequires,
});

var cacheKeyFunction = createCacheKeyFunction([
  __filename,
  path.join(__dirname, '..', '..', 'node_modules', 'fbjs', 'package.json'),
  path.join(__dirname, '..', '..', 'node_modules', 'fbjs-scripts', 'package.json'),
]);

module.exports = {
  process: function(src, path) {
    return babel.transform(src, assign({filename: path}, babelOpts)).code;
  },
  getCacheKey: cacheKeyFunction,
};
