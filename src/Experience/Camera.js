import * as THREE from 'three';
import Experience from './Experience.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera {
    constructor(_options) {
        // Options
        this.experience = new Experience();
        this.config = this.experience.config;
        this.debug = this.experience.debug;
        this.time = this.experience.time;
        this.sizes = this.experience.sizes;
        this.targetElement = this.experience.targetElement;
        this.scene = this.experience.scene;

        // Set up
        this.mode = 'default'; // default \ debug

        this.setInstance();
        this.setModes();
    }

    setInstance() {
        // Set up
        this.instance = new THREE.PerspectiveCamera(
            30,
            this.config.width / this.config.height,
            0.1,
            150
        );
        this.instance.rotation.reorder('YXZ');
        this.instance.lookAt(new THREE.Vector3(1000, 1000, -100));
        this.scene.add(this.instance);
    }

    setModes() {
        this.modes = {};

        // Default
        this.modes.default = {};
        this.modes.default.instance = this.instance.clone();
        this.modes.default.instance.rotation.reorder('YXZ');

        // Debug
        this.modes.debug = {};
        this.modes.debug.instance = this.instance.clone();
        this.modes.debug.instance.rotation.reorder('YXZ');
        this.modes.debug.instance.position.set(-15, 15, 15);

        this.modes.debug.orbitControls = new OrbitControls(
            this.modes.debug.instance,
            this.targetElement
        );
        this.modes.debug.orbitControls.enabled = false;
        this.modes.debug.orbitControls.screenSpacePanning = true;
        this.modes.debug.orbitControls.enableKeys = false;
        this.modes.debug.orbitControls.zoomSpeed = 0.25;
        this.modes.debug.orbitControls.enableDamping = true; //设置控制器阻尼，
        this.modes.debug.orbitControls.update();
    }

    resize() {
        this.instance.aspect = this.config.width / this.config.height;
        this.instance.updateProjectionMatrix();

        this.modes.default.instance.aspect = this.config.width / this.config.height; //更新摄像头
        this.modes.default.instance.updateProjectionMatrix(); //更新摄像机矩阵

        this.modes.debug.instance.aspect = this.config.width / this.config.height;
        this.modes.debug.instance.updateProjectionMatrix();
    }

    update() {
        // Update debug orbit controls
        this.modes.debug.orbitControls.update();

        // Apply coordinates
        this.instance.position.copy(this.modes[this.mode].instance.position);
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion);
        this.instance.updateMatrixWorld(); // To be used in projection
    }

    destroy() {
        this.modes.debug.orbitControls.destroy();
    }
}
