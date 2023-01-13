import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import * as THREE from 'three'
const envLoader = new RGBELoader()
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()

dracoLoader.setDecoderPath(
	'https://www.gstatic.com/draco/versioned/decoders/1.4.3/'
)
gltfLoader.setDRACOLoader(dracoLoader)

export default async function loadModels(scene) {
	const [{ scene: gltfScene }, env] = await Promise.all([
		/*
			"Human Heart" (https://skfb.ly/oxprw) by sahilseth is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/)
		*/
		new Promise((res) => gltfLoader.load('/human_heart.glb', res)),
		new Promise((res) =>
			envLoader.load(
				'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr',
				res
			)
		),
	])
	// gltfScene.scale.set(3, 3, 3)
	// gltfScene.position.set(0, -2.7, 0)
	// console.log(gltfScene)
	// // "pCone1_lambert1_0"
	// const crystallize = gltfScene.getObjectByName(
	// 	'Crystal_Heart_Crystal_Heart_Mat_0'
	// )
	// crystallize.material = Object.assign(new MeshTransmissionMaterial(10), {
	// 	clearcoat: 1,
	// 	clearcoatRoughness: 0,
	// 	transmission: 1,
	// 	chromaticAberration: 0.03,
	// 	anisotropy: 0.1,
	// 	// Set to > 0 for diffuse roughness
	// 	roughness: 0,
	// 	thickness: 1.5,
	// 	ior: 1.5,
	// 	// Set to > 0 for animation
	// 	distortion: 0.1,
	// 	distortionScale: 0.4,
	// 	temporalDistortion: 0.3,
	// })
	scene.environment = env
	scene.environment.mapping = THREE.EquirectangularReflectionMapping
	scene.add(gltfScene)
}
