/// <reference path="lib/underscore.d.ts" />

import Tools = require("tools");

var rng:Tools.RNG = new Tools.RNG(42);

var debug = document.getElementById('debug');
var data:number[] = [1, 2, 3, 4];

data = _.map(data, (x) => rng.nextInt(0, x * 10));
_.map(data, (x) => (debug.textContent += x + ", "))

