define(function (required) {
    CONTEXT = {};
    CONTEXT.screen = document.getElementById('leap-designer');
    CONTEXT.width = 800;
    CONTEXT.height = 600;

    var cube;
    var attached = true;

    function init() {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, CONTEXT.width / CONTEXT.height, 1, 1000);

        camera.position.fromArray([0, 6, 30]);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(camera);

        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(CONTEXT.width, CONTEXT.height);

        CONTEXT.screen.appendChild(renderer.domElement);
        renderer.render(scene, camera);

        CONTEXT.camera = camera;
        CONTEXT.scene = scene;
        CONTEXT.renderer = renderer;
    }

    init();


    function animate() {
        requestAnimationFrame(animate);
        CONTEXT.renderer.render(CONTEXT.scene, CONTEXT.camera);
    }

    // Set up the controller:
    Leap.loop({background: true}, {
        hand: function (hand) {
            console.log(hand);

            if (hand.pinchStrength.toPrecision(2) > 0.8) {
                var handMesh = hand.data('riggedHand.mesh');

                var thumbPosition = new THREE.Vector3(0, 0, 0);
                handMesh.scenePosition(hand.thumb.tipPosition, thumbPosition);

                if (thumbPosition.distanceTo(cube.position) < 2) {
                    attached = true;
                }
                else {
                    attached = false;
                }
            }
            else {
                attached = false;
            }
            if (attached) {
                handMesh.scenePosition(hand.thumb.tipPosition, cube.position);
            }
        }
    });

    visualizeHand = function (controller) {
        controller.use('riggedHand', {
            scale: 1.3,
            positionScale: 2,
            parent: CONTEXT.scene,
            scene: CONTEXT.scene,
            camera: CONTEXT.camera,
            renderer: CONTEXT.renderer,

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

        var camera = CONTEXT.camera;
        var scene = CONTEXT.scene;
        var renderer = CONTEXT.renderer;

        camera.position.set(-8, 8, 20);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        renderer.shadowMapEnabled = true;


        light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 500, 0);
        light.castShadow = true;
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;
        var d = 200;
        light.shadowCameraLeft = -d;
        light.shadowCameraRight = d;
        light.shadowCameraTop = d * 2;
        light.shadowCameraBottom = -d * 2;

        light.shadowCameraNear = 100;
        light.shadowCameraFar = 600;
//		light.shadowCameraVisible = true;
        scene.add(light);

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);

        material = new THREE.MeshBasicMaterial({color: 0xaaaaaa });
        geometry = new THREE.BoxGeometry(100, 1, 100);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.y -= 10;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        animate();
    };

    visualizeHand(Leap.loopController);
})