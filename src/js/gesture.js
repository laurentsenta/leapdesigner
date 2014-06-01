define(function () {

    var event_builder = function (name, value, source) {
        return {"name": name, "value": value, "source": source};
    };

    var data = {};

    var hand_handler = function (callback) {
        return function (hand) {
            var pinchStrength = hand.pinchStrength.toPrecision(2);
            var id = hand.id;

            if (data[id] == undefined) {
                data[id] = {};
            }

            if (pinchStrength > 0.8) {
                if (!data[id].pinched) {
                    callback(event_builder("pinch", pinchStrength, hand));
                    data[id].pinched = true;
                }
                else {
                    var handMesh = hand.data('riggedHand.mesh');
                    var thumbPosition = new THREE.Vector3(0, 0, 0);
                    handMesh.scenePosition(hand.thumb.tipPosition, thumbPosition);

                    callback(event_builder("pinch_move", thumbPosition, hand));
                }
            }
            else if (data[id].pinched) {
                callback(event_builder("unpinch", pinchStrength, hand));
                data[id].pinched = false;
            }
        }
    };

    var module = {"hand_handler": hand_handler};

    return module;
});