define(function () {
    var module = {};

    module.interactor = function (gesture, world) {
        var that = this;

        this.gesture = gesture;
        this.world = world;

        this.event_handler = function (event) {
            if (event.name == "pinch") {
                var hand = event.source;

                var handMesh = hand.data('riggedHand.mesh');
                var thumbPosition = new THREE.Vector3(0, 0, 0);
                handMesh.scenePosition(hand.thumb.tipPosition, thumbPosition);

                var block = world.getBlockAt(thumbPosition, 5);

                if (block) {
                    block.material.color.setHex(0xEE00EE);
                }
            }
        }

        this.hand_handler = gesture.hand_handler(this.event_handler);
    }

    return module;
});