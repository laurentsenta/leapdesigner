define(function () {

    var event_builder = function (name, details, source) {
        return {"name": name, "details": details, "source": source};
    };

    var data = {};

    var hand_to_three = function (hand, leap_item) {
        var mesh = hand.data('riggedHand.mesh');
        var result = new THREE.Vector3(0, 0, 0);
        mesh.scenePosition(leap_item, result);
        return result;
    }

    var hand_handler = function (callback) {
        return function (hand) {
            var pinchStrength = hand.pinchStrength.toPrecision(2);
            var id = hand.id;

            if (data[id] == undefined) {
                data[id] = {};
            }

            if (pinchStrength > 0.8) {
                if (!data[id].pinched) {
                    callback(event_builder("pinch",
                        {"strengh": pinchStrength,
                            "position": hand_to_three(hand, hand.thumb.tipPosition)},
                        hand));

                    data[id].pinched = true;
                }
                else {
                    callback(event_builder("pinch_move",
                        {"strengh": pinchStrength,
                            "position": hand_to_three(hand, hand.thumb.tipPosition)},
                        hand));
                }
            }
            else if (data[id].pinched) {
                callback(event_builder("unpinch",
                    {"strengh": pinchStrength,
                        "position": hand_to_three(hand, hand.thumb.tipPosition)},
                    hand));
                data[id].pinched = false;
            }
        }
    };

    var module = {"hand_handler": hand_handler};

    return module;
});