/// <reference path="lib/three.d.ts" />
/// <reference path="lib/underscore.d.ts" />
define(["require", "exports"], function(require, exports) {
    var Block = (function () {
        function Block(x, y, z, width, height, depth) {
            this.material = new THREE.MeshBasicMaterial({ color: 0x6600EE });
            this.geometry = new THREE.BoxGeometry(width, height, depth);
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.position = new THREE.Vector3(x, y, z);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
        }
        Block.prototype.distanceTo = function (position) {
            return this.mesh.position.distanceTo(position);
        };
        return Block;
    })();
    exports.Block = Block;

    var World = (function () {
        function World(scene) {
            this.scene = scene;
            this.blocks = [];
        }
        World.prototype.addBlock = function (x, y, z) {
            var b = new Block(x, y, z, 1, 1, 1);
            this.register(b);
        };

        World.prototype.register = function (item) {
            this.blocks.push(item);
            this.scene.add(item.mesh);
        };

        World.prototype.getBlockAt = function (position, distance) {
            var closest = _.min(this.blocks, function (block) {
                return block.distanceTo(position);
            });

            if (closest && closest.distanceTo(position) < distance) {
                return closest;
            } else {
                return null;
            }
        };
        return World;
    })();
    exports.World = World;
});
//# sourceMappingURL=world.js.map
