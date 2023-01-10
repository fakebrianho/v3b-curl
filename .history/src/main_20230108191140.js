import './style.css'
import * as THREE from 'three'
import { sizes, camera } from './camera'
import addLight from './lights'
import { addMeshes, addShader } from './addMeshes'
import { PARAMS, pane, orbit } from './controls'
import { resize } from './eventListeners'
import { getRandomSpherePoint } from './getRandomSpherePoint'
import vertexShader from '/@/shaders/vertex.glsl'
import fragmentShader from '/@/shaders/fragment.glsl'
let renderer, scene, simulationMaterial, renderMaterial, fbo, fullScreenQuad
renderer = new THREE.WebGLRenderer()
scene = new THREE.Scene()

const meshes = {}
const lights = {}

init()
function init() {
	renderer.setSize(sizes.width, sizes.height)
	document.body.appendChild(renderer.domElement)
	meshes.default = addMeshes()
	meshes.shader = addShader()
	lights.default = addLight()
	scene.add(meshes.default)
	scene.add(meshes.shader)
	scene.add(lights.default)
	resize(camera, renderer, sizes)
	orbit(camera, renderer)
	animate()
}
function initFbo() {
	// Set up the FBO
	const fboWidth = 512
	const fboHeight = 512
	const fboParams = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat,
	}
	const fbo = new THREE.WebGLRenderTarget(fboWidth, fboHeight, fboParams)
	let length = width * height * 3
	let data = new Float32Array(length)
	for (let i = 0; i < length; i += 3) {
		// Random positions inside a sphere
		const point = getRandomSpherePoint()
		data[i + 0] = point.x
		data[i + 1] = point.y
		data[i + 2] = point.z
	}
	// Convert the data to a FloatTexture
	const positions = new THREE.DataTexture(
		data,
		width,
		height,
		THREE.RGBFormat,
		THREE.FloatType
	)
	positions.needsUpdate = true
	simulationMaterial = new THREE.ShaderMaterial({
		vertexShader: simVertex,
		fragmentShader: simFragment,
		uniforms: {
			positions: { value: positions },
			uTime: { value: 0 },
			// uSpeed: { value: this.tweaks.speed },
			// uCurlFreq: { value: this.tweaks.curlFreq },
		},
	})
	renderMaterial = new THREE.ShaderMaterial({
		vertexShader: particlesVertex,
		fragmentShader: particlesFragment,
		uniforms: {
			positions: { value: null },
			uTime: { value: 0 },
			// uPointSize: { value: this.tweaks.pointSize },
			// uOpacity: { value: this.tweaks.opacity },
		},
		transparent: true,
		blending: THREE.AdditiveBlending,
	})
}
function createScreenQuad() {
	const geometry = new THREE.PlaneGeometry(2, 2)
	const material = new THREE.ShaderMaterial({
		vertexShader: fullScreenVertex,
		fragmentShader: fullScreenFragment,
		uniforms: {
			uTime: { value: 0 },
			uResolution: {
				value: new THREE.Vector2(store.bounds.ww, store.bounds.wh),
			},
		},
		depthTest: false,
		blending: THREE.AdditiveBlending,
	})

	fullScreenQuad = new THREE.Mesh(geometry, material)
	scene.add(fullScreenQuad)
}
function animate() {
	requestAnimationFrame(animate)
	meshes.shader.material.uniforms.uTime.value += 0.1
	meshes.shader.material.uniforms.displacementStrength.value =
		PARAMS.displacementStrength
	meshes.shader.rotation.y -= 0.01
	meshes.shader.rotation.z += 0.01
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y += 0.01
	renderer.render(scene, camera)
}
