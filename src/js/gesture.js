define(function () {

    var event_builder = function (name, value, source) {
        return {"name": name, "value": value, "source": source};
    };

    var hand_handler = function (callback) {
        return function (hand) {
            var pinchStrength = hand.pinchStrength.toPrecision(2);

            if (pinchStrength > 0.8) {
                var handMesh = hand.data('riggedHand.mesh');
                callback(event_builder("pinch", pinchStrength, hand));
            }
        }
    };

    var module = {"hand_handler": hand_handler};

    return module;
});