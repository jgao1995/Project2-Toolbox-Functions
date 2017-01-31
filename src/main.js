
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

var tick = 0;
var feathers = 100;
var flap_motion = 100;
var featherGeo;

// bone stuff
var bone_geometry = new THREE.Geometry();
var curve = new THREE.QuadraticBezierCurve3();
var boneMaterial = new THREE.LineBasicMaterial( { color: 0xe3dac9, linewidth: 1 } );
var bone = new THREE.Line(bone_geometry, boneMaterial);


var base_color = 0x000000;

var feather_color = function() {
    this.color = 0;
};

var visible_feathers = function() {
    this.feather_count = 100;
}

var wind_speed = function() {
    this.wind_speed = 0;
};

var wing_curve = function() {
    this.curve = 0;
};

var wind_direction = function() {
    this.wind_direction = 0;
}

// defining our scales
var wind_speed_scale = new wind_speed();
var wing_curve_scale = new wing_curve();
var feather_color_scale = new feather_color();
var visible_feathers_scale = new visible_feathers();
var wind_direction_scale = new wind_direction();

// called after the scene loads
function onLoad(framework) {
    var scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;

    // Basic Lambert white
    var lambertWhite = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });

    // Set light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.position.set(1, 3, 2);
    directionalLight.position.multiplyScalar(10);

    // set skybox
    var loader = new THREE.CubeTextureLoader();
    var urlPrefix = '/images/skymap/';

    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
        urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
        urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
    ] );

    scene.background = skymap;

    curve.v0 = new THREE.Vector3(0, 0, 0);
    curve.v1 = new THREE.Vector3(3, 0, 0);
    curve.v2 = new THREE.Vector3(6, 0, 0);
    for (var j = 0; j < feathers; j++) {
        bone_geometry.vertices.push(curve.getPoint(j / feathers));
    }
    scene.add(bone);

    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();
    objLoader.load('/geo/feather.obj', function(obj) {

        // LOOK: This function runs after the obj has finished loading
        featherGeo = obj.children[0].geometry;

        var featherMesh = new THREE.Mesh(featherGeo, lambertWhite);
        featherMesh.name = "feather";
        featherMesh.position.set(0.1, 0.3, 0);
        //var clone = featherMesh.clone(true);
        //clone.position.set(0.0, 0.0, 0.0);
        //clone.rotateZ(-70);
        // Y by PI/2
        // Z by 180
        //scene.add(featherMesh);
        for (var i = 0; i < bone_geometry.vertices.length; i++) {
            var vertex = bone_geometry.vertices[i];
            var feather = featherMesh.clone(true);
            feather.name = i;
            feather.position.set(vertex.x, vertex.y, vertex.z);
            feather.rotateY(90);
            feather.rotateZ(180);
            feather.scale.set((i/feathers), (i/feathers), (i/feathers));
            feather.traverse( function ( object ) { object.visible = true; } );
            scene.add(feather);
        }
    });

    // set camera position
    camera.position.set(0, 1, 5);
    camera.lookAt(new THREE.Vector3(0,0,0));

    // scene.add(lambertCube);
    scene.add(directionalLight);

    // edit params and listen to changes like this
    // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
    gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
        camera.updateProjectionMatrix();
    });

    gui.add(wind_speed_scale, 'wind_speed', 0, 100).onChange(function(newVal) {
        wind_speed_scale.scale = newVal;
    });

    gui.add(feather_color_scale, 'color', 0, 100).onChange(function(newVal) {
        feather_color_scale.color = newVal;
    });

    gui.add(visible_feathers_scale, 'feather_count', 0, 100).onChange(function(newVal) {
        visible_feathers_scale.feather_count = newVal;
        for (var i = 0; i < newVal; i++) {
            var feather = framework.scene.getObjectByName(i);
            if (feather) {
                feather.traverse( function ( object ) { object.visible = true; });
            }
        }
        for (var i = Math.round(newVal); i < 100; i++) {
            var feather = framework.scene.getObjectByName(i);
            if (feather) {
                feather.traverse( function ( object ) { object.visible = false; });
            }
        }
    });

    gui.add(wing_curve_scale, 'curve', -5, 5).onChange(function(newVal) {
        wing_curve_scale.curve = newVal;
        curve.v1 = new THREE.Vector3(3, newVal, 0);
        //curve.v2 = new THREE.Vector3(6, newVal, 0);
        scene.remove(bone);
        bone_geometry = new THREE.Geometry();
        for (var j = 0; j < feathers; j++) {
            bone_geometry.vertices.push(curve.getPoint(j / feathers));
        }
        bone = new THREE.Line(bone_geometry, boneMaterial);
        scene.add(bone);

        for (var i = 0; i < bone_geometry.vertices.length; i++) {
            var vertex = bone_geometry.vertices[i];
            var feather = framework.scene.getObjectByName(i);
            feather.position.set(vertex.x, vertex.y, vertex.z);
        }

        for (var i = 0; i < visible_feathers_scale.feather_count; i++) {
            var feather = framework.scene.getObjectByName(i);
            feather.traverse( function ( object ) { object.visible = true; });
        }
        for (var i = Math.round(visible_feathers_scale.feather_count); i < 100; i++) {
            var feather = framework.scene.getObjectByName(i);
            feather.traverse( function ( object ) { object.visible = false; });
        }
    });

    gui.add(wind_direction_scale, 'wind_direction', 0, 1).onChange(function(newVal) {
        wind_direction_scale.wind_direction = newVal;
    });
}

// called on frame updates
function onUpdate(framework) {
    //var feather = framework.scene.getObjectByName("feather");
    //if (feather !== undefined) {
        // Simply flap wing
        //feather.rotateZ(Math.sin(date.getTime() / 100) * 2 * Math.PI / 180);
    //}
    tick += 1;
    for (var i = 0; i < visible_feathers_scale.feather_count; i++) {
        var feather = framework.scene.getObjectByName(i);
        var date = new Date();
        if (feather !== undefined) {
            feather.material.color.set(base_color + feather_color_scale.color * 167772);

            if (wind_direction_scale.wind_direction == 0) {
                feather.rotateZ(wind_speed_scale.wind_speed / 100 * Math.sin(i * flap_motion + date.getTime() / 100) * 2 * Math.PI / 180);
            }
            else {
                feather.rotateY(wind_speed_scale.wind_speed / 100 * Math.cos(i * flap_motion + date.getTime() / 100) * 2 * Math.PI / 180);
            }
        }
    }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
