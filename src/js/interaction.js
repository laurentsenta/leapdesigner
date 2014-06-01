/**
 * Interpret abstract events into
 * events in the Three.js world.
 *
 * Supposed to provide an high level interface
 * to interact with objects (pinch a cube => do something, etc).
 *
 * Wrap a gesture object that produces events and
 * give them a meaning in the provided 3D world.
 */

define(function () {
    var module = {};


    module.interactor = function (gesture, world) {
        this.gesture = gesture;
        this.world = world;
        var data = {};

        this.event_handler = function (event) {
            var source = event.source;
            var source_id = source.id;

            if (data[source_id] == undefined) {
                data[source_id] = {};
            }

            // Change the color of pinched blocks
            if (event.name == "pinch") {
                if (data[source_id].pinched != undefined) {
                    return;
                }

                var position = event.details.position;
                var block = world.getBlockAt(position, 5);

                if (block) {
                    block.material.color.setHex(0x42c94f);
                    data[source_id].pinched = block;
                }
            }
            // Move pinched blocks
            if (event.name == "pinch_move") {
                if (data[source_id].pinched == undefined) {
                    return;
                }

                var position = event.details.position;
                data[source_id].pinched.mesh.position = position;
            }
            // Release pinched blocks
            if (event.name == "unpinch") {
                if (data[source_id].pinched == undefined) {
                    return;
                }

                var block = data[source_id].pinched;

                if (block) {
                    block.material.color.setHex(0x535474);
                    data[source_id].pinched = undefined;
                }
            }
        }

        this.hand_handler = gesture.hand_handler(this.event_handler);
    }

    return module;
});