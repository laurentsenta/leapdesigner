/// <reference path="lib/underscore.d.ts" />
define(["require", "exports", "tools"], function(require, exports, Tools) {
    var rng = new Tools.RNG(42);

    var debug = document.getElementById('debug');
    var data = [1, 2, 3, 4];

    data = _.map(data, function (x) {
        return rng.nextInt(0, x * 10);
    });
    _.map(data, function (x) {
        return (debug.textContent += x + ", ");
    });
});
//# sourceMappingURL=main.js.map
