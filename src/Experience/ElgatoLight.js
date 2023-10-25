import * as THREE from 'three';

import Experience from './Experience.js';

export default class ElgatoLight {
    constructor() {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

        this.setModel();
    }

    setModel() {
        this.model = {};

        this.model.mesh = this.resources.items.elgatoLightModel.scene.children[0];
        console.log('elgatoLightModel', this.model.mesh);
        this.scene.add(this.model.mesh);

        this.model.mesh.material = new THREE.MeshBasicMaterial({
            color: 0x898dfd
        });
    }
}
