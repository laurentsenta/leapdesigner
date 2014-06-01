
// copyright (c) 2014-04-27 ~ Theo Armour ~ MIT License
var renderer, scene, camera, controls, stats;
var info, palm, phalanges = [];

init();
animate();

function init() {
    var css, light, geometry, material, mesh;

    css = document.body.appendChild( document.createElement('style') );
    css.innerHTML = 'body { font: 600 12pt monospace; margin: 0; overflow: hidden; text-align: center; }' +
        'h1 a { text-decoration: none;} ' +
        '';

    info = document.body.appendChild( document.createElement( 'div' ) );
    info.style.cssText = 'left: 0; margin: auto; position: absolute; right: 0; width: 50%; ';
    info.innerHTML = info.txt = '<h1>' +
        document.title + ' ~ ' +
        '<a href=# onclick=toggleInfo() >&#x24D8;</a>' +
        '</h1>' +
        '<p>Show one hand and five fingers to start</p>' +
        '<div id=data ></div>' +
        '';

// Three.js basics
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0xffffff } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 3000 );
    camera.position.set( 0, 250, 600 );
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.target.set( 0, 100, 0 );

    stats = new Stats();
    stats.domElement.style.cssText = 'position: absolute; top: 0px; zIndex: 100; ';
    document.body.appendChild( stats.domElement );

//  Lights
    light = new THREE.AmbientLight( 0x333333);
    light.color.setHSL( 0.1, 0.5, 0.3 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 0, 500, 0 );
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
    scene.add( light );

// ground plane
    material = new THREE.MeshLambertMaterial( {color: 0xaaaaaa } );
    geometry = new THREE.BoxGeometry( 600, 10, 300 );
    mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

// palm
    geometry = new THREE.BoxGeometry( 80, 20, 80 );
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, -30 ) );  // to to +30 if using pitch roll & yaw
    material = new THREE.MeshNormalMaterial();
    palm = new THREE.Mesh( geometry, material );
    palm.castShadow = true;
    palm.receiveShadow = true;
    scene.add( palm );

// phalanges
    geometry = new THREE.BoxGeometry( 16, 12, 1 );
    for ( var i = 0; i < 15; i++) {
        mesh = new THREE.Mesh( geometry, material );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add( mesh );
        phalanges.push( mesh );
    }
}

function toggleInfo() {
    info.innerHTML = info.txt +
        '<div onclick=info.innerHTML=info.txt style=background-color:#ccc;opacity:0.7;padding:10px;text-align:left; >' +
        'Some helpful text can go here.<br>' +
        'Such as: use your pointing device to zoom, pan and rotate.<br>' +
        '<a href="https://github.com/jaanga/gestification/tree/gh-pages/cookbook/boilerplate" target="_blank">Source code.</a><br>' +
        '<small>' +
        'credits: <a href="http://threejs.org" target="_blank">three.js</a> - ' +
        '<a href="http://leapmotion.com" target="_blank">leap motion</a> - ' +
        '<a href="http://khronos.org/webgl/" target="_blank">webgl</a> - ' +
        '<a href="http://jaanga.github.io" target="_blank">jaanga</a><br>' +
        'copyright &copy; 2014 jaanga authors ~ mit license' +
        '</small><br><br>' +
        '<i>Click anywhere in this message to hide...</i>' +
        '</div>';
}

Leap.loop( function( frame ) {
    var hand, phalanx, point, length;
    if ( frame.hands.length ) {
        hand = frame.hands[0];
        palm.position.set( hand.stabilizedPalmPosition[0], hand.stabilizedPalmPosition[1], hand.stabilizedPalmPosition[2] );
//			palm.rotation.set( hand.pitch(), -hand.yaw(), hand.roll() );
        direction = new THREE.Vector3( hand.direction[0], hand.direction[1], hand.direction[2] );  // best so far
        palm.lookAt( direction.add( palm.position ) );
        palm.rotation.z = -hand.roll();

        data.innerHTML = 'Hand X:' + hand.stabilizedPalmPosition[0].toFixed(0) + ' Y:' +  hand.stabilizedPalmPosition[1].toFixed(0) + ' Z:' + hand.stabilizedPalmPosition[2].toFixed(0);
    }
    iLen = ( frame.pointables.length < 5 ) ? frame.pointables.length : 5;
    for (var i = 0; i < iLen; i++) {
        for ( var j = 0; j < 3; j++) {
            phalanx = phalanges[ 3 * i + j];
            point = frame.pointables[i].positions[j];
            phalanx.position.set( point[0], point[1], point[2] );
            point = frame.pointables[i].positions[ j + 1 ];
            point = new THREE.Vector3( point[0], point[1], point[2] );
            phalanx.lookAt( point );
            length = phalanx.position.distanceTo( point );
            phalanx.translateZ( 0.5 * length );
            phalanx.scale.set( 1, 1, length );
        }
    }
});

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    controls.update();
    stats.update();
}