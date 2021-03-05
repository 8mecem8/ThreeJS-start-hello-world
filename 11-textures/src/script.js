import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'



//Textures
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./textures/door/color.jpg')
const ctexture = textureLoader.load('./textures/checkerboard-1024x1024.png')
const actexture = textureLoader.load('./textures/checkerboard-8x8.png')



//texture.repeat.x = 1.25
//texture.repeat.y = 0.85

//texture.wrapS = THREE.RepeatWrapping
//texture.wrapT = THREE.RepeatWrapping

//texture.wrapS = THREE.MirroredRepeatWrapping
//texture.wrapT = THREE.MirroredRepeatWrapping

//texture.offset.x = 0.23
//texture.offset.y = 0.05

//texture.rotation = Math.PI * 0.14 //2 //1.83
//texture.center.x = 0.1
//texture.center.x = 0.5

actexture.generateMipmaps = false // for performanse update
//actexture.minFilter = THREE.NearestFilter
actexture.magFilter = THREE.NearestFilter //better quality filter even for small strected textures



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
//const geometry = new THREE.SphereGeometry(1,32,32)
//const geometry = new THREE.TorusGeometry(1,0.35,32,100)
const material = new THREE.MeshBasicMaterial({ map: actexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()