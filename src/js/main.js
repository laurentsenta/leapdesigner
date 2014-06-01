define(function (require) {
    var Gesture = require('./gesture');
    var Interaction = require('./interaction');
    var World = require('./world');

    // Good ol' global variable that contains the project info
    CONTEXT = {};
    CONTEXT.screen = document.getElementById('leap-designer');
    CONTEXT.width = 800;
    CONTEXT.height = 600;

    /**
     * Init the Context,
     * - Setup Three.JS
     * - The project "Engines" (interactions engine, etc).
     * - Feed the initial world with some lights and cubes.
     */
    function init() {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, CONTEXT.width / CONTEXT.height, 1, 1000);
        var renderer = new THREE.WebGLRenderer({alpha: true});
        var screen = CONTEXT.screen;

        camera.position.fromArray([0, 6, 30]);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        scene.add(camera);

        renderer.setClearColor(0x000000, 0);
        renderer.setSize(CONTEXT.width, CONTEXT.height);

        renderer.shadowMapEnabled = true;

        screen.appendChild(renderer.domElement);
        renderer.render(scene, camera);

        // Create lights & shadws.
        light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 500, 0);
        light.castShadow = true;
        light.shadowMapWidth = 1024;
        light.shadowMapHeight = 1024;

        // Magic values to optimize the shadow map
        var d = 50;
        light.shadowCameraLeft = -d;
        light.shadowCameraRight = d;
        light.shadowCameraTop = d;
        light.shadowCameraBottom = -d;

        light.shadowCameraNear = 100;
        light.shadowCameraFar = 600;

        scene.add(light);

        // Ground
        material = new THREE.MeshBasicMaterial({color: 0xffd8bf });
        geometry = new THREE.BoxGeometry(100, 1, 100);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.y -= 10;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        // Update the global Context
        CONTEXT.camera = camera;
        CONTEXT.scene = scene;
        CONTEXT.renderer = renderer;

        CONTEXT.world = new World.World(scene);
        CONTEXT.Interactor = new Interaction.interactor(Gesture, CONTEXT.world);

        // Generate a few initial blocks
        CONTEXT.world.addBlock(-2, -2, -2);
        CONTEXT.world.addBlock(0, 0, 0);

        for (var i = 0; i < 20; i++) {
            CONTEXT.world.addBlock(Math.random() * 30 - 15, Math.random() * 30 - 15, Math.random() * 30 - 15);
        }
    }

    /**
     * Rendering loop for Three.js
     */
    function animate() {
        requestAnimationFrame(animate);
        CONTEXT.renderer.render(CONTEXT.scene, CONTEXT.camera);
    }

    init();

    /**
     * The Leap loop:
     * - hand events -> interactor.hand_handler
     */
    Leap.loop({background: true}, {
        hand: CONTEXT.Interactor.hand_handler,
    });

    /**
     * Use the RiggedHand Plugin to render the hands
     * - Use the context we created to render the system
     * - Change the model when pinching (may be useful later)
     * - Start the three.js loop (animate)
     *
     * @param controller
     */
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