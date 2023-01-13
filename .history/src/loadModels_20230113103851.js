import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { MeshTransmissionMaterial } from './meshTransmissionMaterial'
import * as THREE from 'three'
const envLoader = new RGBELoader()
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()

dracoLoader.setDecoderPath(
	'https://www.gstatic.com/draco/versioned/decoders/1.4.3/'
)
gltfLoader.setDRACOLoader(dracoLoader)

export default async function glb(scene) {
	const [{ scene: gltfScene }, env] = await Promise.all([
		/*
		Author: glenatron (https://sketchfab.com/glenatron)
		License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
		Source: https://sketchfab.com/3d-models/gelatinous-cube-e08385238f4d4b59b012233a9fbdca21
		Title: Gelatinous Cube
		*/
		new Promise((res) => gltfLoader.load('/human_heart.glb', res)),
		new Promise((res) =>
			envLoader.load(
				'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr',
				res
			)
		),
	])
	gltfScene.scale.set(3, 3, 3)
	gltfScene.position.set(0, -2.7, 0)
	console.log(gltfScene)
	// "pCone1_lambert1_0"
	const crystallize = gltfScene.getObjectByName(
		'Crystal_Heart_Crystal_Heart_Mat_0'
	)
	crystallize.material = Object.assign(new MeshTransmissionMaterial(10), {
		clearcoat: 1,
		clearcoatRoughness: 0,
		transmission: 1,
		chromaticAberration: 0.03,
		anisotropy: 0.1,
		// Set to > 0 for diffuse roughness
		roughness: 0,
		thickness: 1.5,
		ior: 1.5,
		// Set to > 0 for animation
		distortion: 0.1,
		distortionScale: 0.4,
		temporalDistortion: 0.3,
	})
	scene.environment = env
	scene.environment.mapping = THREE.EquirectangularReflectionMapping
	scene.add(gltfScene)
}
