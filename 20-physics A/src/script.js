import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import CANNON from 'cannon' 
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { Camera } from 'three'



//Stats
let stats = new Stats()
document.body.appendChild( stats.dom );


/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#6fa284');

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

//Physics 

const world = new CANNON.World()
world.gravity.set(0,-9.82,0)


//Materials

//we can only use 1 material for everything 
const concreteMaterial = new CANNON.Material('concrete')
const plasticMaterial = new CANNON.Material('plastic')



const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(concretePlasticContactMaterial)




//Sphere of Physics

const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0,2.5,0),
    shape: sphereShape,
    material: plasticMaterial
})
//sphereBody.addShape(sphereShape)
//sphereBody.applyLocalForce(new CANNON.Vec3(750,0,0),new CANNON.Vec3(0,0,0))

setTimeout(function()
{ sphereBody.applyLocalForce
    (new CANNON.Vec3(-455,0,0),new CANNON.Vec3(0,0,0)); 
                                            }, 3000);

world.add(sphereBody)







//Floor

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.material= concreteMaterial
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1,0,0),
    Math.PI * 0.5
)
world.add(floorBody)

/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture
    })
)
sphere.castShadow = true
sphere.position.y = 0.5
scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()



let oldelapsedTime = 0


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const diffTime = elapsedTime - oldelapsedTime
        oldelapsedTime = elapsedTime


    //Update Pysics


    sphereBody.applyForce(new CANNON.Vec3(-0.8,0,0), sphereBody.position)

    world.step(1/60,diffTime ,3)


    sphere.position.copy(sphereBody.position)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    //Stats Update
    stats.update();
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()