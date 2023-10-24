import * as THREE from 'three';

import Experience from './Experience.js';
import vertexShader from './shaders/baked/vertex.glsl';
import fragmentShader from './shaders/baked/fragment.glsl';

export default class CoffeeSteam {
    constructor() {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;
        this.scene = this.experience.scene;
        this.time = this.experience.time;

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder({
                title: 'baked',
                expanded: true
            });
        }
        console.log('new baked', this);
        this.setModel();
    }

    setModel() {
        this.model = {};
        console.log('new baked roommodel', this.resources.items.roomModel.scene.children);
        this.model.mesh = this.resources.items.roomModel.scene.children[0];

        this.model.bakedDayTexture = this.resources.items.bakedDayTexture;
        this.model.bakedDayTexture.encoding = THREE.sRGBEncoding;
        this.model.bakedDayTexture.flipY = false; //纹理上传到GPU时沿垂直轴翻转 true

        this.model.bakedNightTexture = this.resources.items.bakedNightTexture;
        this.model.bakedNightTexture.encoding = THREE.sRGBEncoding;
        this.model.bakedNightTexture.flipY = false;

        this.model.bakedNeutralTexture = this.resources.items.bakedNeutralTexture;
        this.model.bakedNeutralTexture.encoding = THREE.sRGBEncoding;
        this.model.bakedNeutralTexture.flipY = false;

        this.model.lightMapTexture = this.resources.items.lightMapTexture;
        this.model.lightMapTexture.flipY = false;

        this.colors = {};
        this.colors.tv = '#ff115e';
        this.colors.desk = '#ff6700';
        this.colors.pc = '#0082ff';

        // 自定义着色器材质
        this.model.material = new THREE.ShaderMaterial({
            uniforms: {
                uBakedDayTexture: { value: this.model.bakedDayTexture },
                uBakedNightTexture: { value: this.model.bakedNightTexture },
                uBakedNeutralTexture: { value: this.model.bakedNeutralTexture },
                uLightMapTexture: { value: this.model.lightMapTexture },

                uNightMix: { value: 1 },
                uNeutralMix: { value: 0 },

                uLightTvColor: { value: new THREE.Color(this.colors.tv) },
                uLightTvStrength: { value: 1.47 },

                uLightDeskColor: { value: new THREE.Color(this.colors.desk) },
                uLightDeskStrength: { value: 1.9 },

                uLightPcColor: { value: new THREE.Color(this.colors.pc) },
                uLightPcStrength: { value: 1.4 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
        this.model.material = new THREE.MeshBasicMaterial(); //网格基础材质，不受带有方向光源影响，没有棱角感
        this.model.material.map = this.model.bakedDayTexture;

        this.model.material = new THREE.MeshNormalMaterial(); //网格法向量材质,是一种比较特殊的材质。它使得物体的每一个面的颜色都从该面向外指的法向量计算得到的。
        this.model.material.flatShading = true; //材质使用平面着色进行渲染
        this.model.material.wireframe = true; //将几何体渲染为线框

        this.model.material = new THREE.MeshMatcapMaterial();
        this.model.material.matcap = this.model.bakedDayTexture;

        this.model.mesh.traverse(_child => {
            if (_child instanceof THREE.Mesh) {
                _child.material = this.model.material;
            }
        });

        this.scene.add(this.model.mesh);

        // Debug
        if (this.debug) {
            this.debugFolder.addInput(this.model.material.uniforms.uNightMix, 'value', {
                label: 'uNightMix',
                min: 0,
                max: 1
            });

            this.debugFolder.addInput(this.model.material.uniforms.uNeutralMix, 'value', {
                label: 'uNeutralMix',
                min: 0,
                max: 1
            });

            this.debugFolder.addInput(this.colors, 'tv', { view: 'color' }).on('change', () => {
                this.model.material.uniforms.uLightTvColor.value.set(this.colors.tv);
            });

            this.debugFolder.addInput(this.model.material.uniforms.uLightTvStrength, 'value', {
                label: 'uLightTvStrength',
                min: 0,
                max: 3
            });

            this.debugFolder.addInput(this.colors, 'desk', { view: 'color' }).on('change', () => {
                this.model.material.uniforms.uLightDeskColor.value.set(this.colors.desk);
            });

            this.debugFolder.addInput(this.model.material.uniforms.uLightDeskStrength, 'value', {
                label: 'uLightDeskStrength',
                min: 0,
                max: 3
            });

            this.debugFolder.addInput(this.colors, 'pc', { view: 'color' }).on('change', () => {
                this.model.material.uniforms.uLightPcColor.value.set(this.colors.pc);
            });

            this.debugFolder.addInput(this.model.material.uniforms.uLightPcStrength, 'value', {
                label: 'uLightPcStrength',
                min: 0,
                max: 3
            });
        }
    }
}
