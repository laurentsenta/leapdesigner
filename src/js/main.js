define(function (require) {

    var Gesture = require('./gesture');
    var Interaction = require('./interaction');

    CONTEXT = {};
    CONTEXT.screen = document.getElementById('leap-designer');
    CONTEXT.width = 800;
    CONTEXT.height = 600;

    var world = require('./world');

    var cube;
    var attached = true;

    // INIT CONTEXT
    function init() {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, CONTEXT.width / CONTEXT.height, 1, 1000);
        var renderer = new THREE.WebGLRenderer();

        camera.position.fromArray([0, 6, 30]);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        scene.add(camera);

        renderer.setClearColor(0x000000, 0);
        renderer.setSize(CONTEXT.width, CONTEXT.height);

        CONTEXT.screen.appendChild(renderer.domElement);
        renderer.render(scene, camera);

        CONTEXT.camera = camera;
        CONTEXT.scene = scene;
        CONTEXT.renderer = renderer;

        // Create context with lights, etc
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
        scene.add(light);

        // Ground
        material = new THREE.MeshBasicMaterial({color: 0xaaaaaa });
        geometry = new THREE.BoxGeometry(100, 1, 100);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.y -= 10;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        CONTEXT.world = new world.World(scene);

        CONTEXT.world.addBlock(0, 0, 0);
        CONTEXT.world.addBlock(-2, -2, -2);
    }

    init();

    function animate() {
        requestAnimationFrame(animate);
        CONTEXT.renderer.render(CONTEXT.scene, CONTEXT.camera);
    }

    var callback = function (event) {
        console.log(event);
    }

    CONTEXT.Interactor = new Interaction.interactor(Gesture, CONTEXT.world);

    // LEAP LOOP
    Leap.loop({background: true}, {
        hand: CONTEXT.Interactor.hand_handler,
    });

// HAND RIGS
    visualizeHand = function (controller) {
        controller.use('riggedHand', {
            scale: 1,
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
        animate();
    };

    visualizeHand(Leap.loopController);
})