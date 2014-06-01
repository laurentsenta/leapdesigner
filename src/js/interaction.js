define(function () {
    var module = {};

    module.interactor = function (gesture, world) {
        var that = this;

        this.gesture = gesture;
        this.world = world;
        var data = {};

        this.event_handler = function (event) {
            var source = event.source;
            var source_id = source.id;

            if (data[source_id] == undefined) {
                data[source_id] = {};
            }

            console.log(event.name + ", " + data[source_id] + ", " + data[source_id].pinched);


            if (event.name == "pinch") {
                if (data[source_id].pinched != undefined) {
                    return;
                }

                var handMesh = source.data('riggedHand.mesh');
                var thumbPosition = new THREE.Vector3(0, 0, 0);
                handMesh.scenePosition(source.thumb.tipPosition, thumbPosition);

                var block = world.getBlockAt(thumbPosition, 5);

                if (block) {
                    block.material.color.setHex(0xEE00EE);
                    data[source_id].pinched = block;
                }
            }
            if (event.name == "pinch_move") {
                if (data[source_id].pinched == undefined) {
                    return;
                }

                var handMesh = source.data('riggedHand.mesh');
                var thumbPosition = new THREE.Vector3(0, 0, 0);
                handMesh.scenePosition(source.thumb.tipPosition, thumbPosition);

                data[source_id].pinched.mesh.position = thumbPosition;
            }
            if (event.name == "unpinch") {
                if (data[source_id].pinched == undefined) {
                    return;
                }

                var handMesh = source.data('riggedHand.mesh');
                var thumbPosition = new THREE.Vector3(0, 0, 0);
                handMesh.scenePosition(source.thumb.tipPosition, thumbPosition);

                var block = data[source_id].pinched; //world.getBlockAt(thumbPosition, 5);

                if (block) {
                    block.material.color.setHex(0x6600EE);
                    data[source_id].pinched = undefined;
                }
            }
        }

        this.hand_handler = gesture.hand_handler(this.event_handler);
    }

    return module;
});