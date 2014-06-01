define(function (required) {
    var screen = document.getElementById('leap-designer');
    var cube;

    // Set up the controller:
    Leap.loop({background: true}, {
        hand: function (hand) {
            console.log(hand);
            if (hand.pinchStrength.toPrecision(2) > 0.8) {
                var handMesh = hand.data('riggedHand.mesh')
                handMesh.scenePosition(hand.thumb.tipPosition, cube.position);
            }
        }
    });

    visualizeHand = function (controller) {
        controller.use('riggedHand', {
            scale: 1.3,
            positionScale: 2,
            boneColors: function (boneMesh, leapHand) {
                if ((boneMesh.name.indexOf('Finger_') == 0)) {
                    if ((boneMesh.name.indexOf('Finger_0') == 0) || (boneMesh.name.indexOf('Finger_1') == 0)) {
                        return {
                            hue: 0.564,
                            saturation: leapHand.pinchStrength,
                            lightness: 0.5
                        }
                    }
                }
            }
        });

        var camera = controller.plugins.riggedHand.camera;
        camera.position.set(-8, 8, 20);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        var scene = controller.plugins.riggedHand.scene;

        var geometry = new THREE.CubeGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
    };

    visualizeHand(Leap.loopController);
})