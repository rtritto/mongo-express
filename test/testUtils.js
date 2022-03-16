'use strict';

const { promisify } = require('util');

exports.asPromise = function (fct) {
  return promisify(fct);
};

exports.timeoutPromise = function (delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};
