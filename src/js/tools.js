define(["require", "exports"], function(require, exports) {
    var RNG = (function () {
        function RNG(seed) {
            this.seed = seed;
        }
        RNG.prototype.next = function (min, max) {
            max = max || 0;
            min = min || 0;

            this.seed = (this.seed * 9301 + 49297) % 233280;
            var rnd = this.seed / 233280;

            return min + rnd * (max - min);
        };

        // http://indiegamr.com/generate-repeatable-random-numbers-in-js/
        RNG.prototype.nextInt = function (min, max) {
            return Math.round(this.next(min, max));
        };

        RNG.prototype.nextDouble = function () {
            return this.next(0, 1);
        };

        RNG.prototype.pick = function (collection) {
            return collection[this.nextInt(0, collection.length - 1)];
        };
        return RNG;
    })();
    exports.RNG = RNG;
});
//# sourceMappingURL=tools.js.map
