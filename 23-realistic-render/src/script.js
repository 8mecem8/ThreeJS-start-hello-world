import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'



//Loaders

const gltf = new GLTFLoader()

const cTL =new THREE.CubeTextureLoader()


//Stats like FPS..
let stats = new Stats()
document.body.appendChild( stats.dom );

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('grey');


//Update all materials

const updateAllMaterials = () => 
{
    scene.traverse((child)=>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
    {
    
       // child.material.envMap = envMap  ==> scene.environment = envMap kullandığımız için gerek yok
        child.material.envMapIntensity = debugObject.envMapIntensity
        child.material.needsUpdate = true
        child.castShadow = true
        child.receiveShadow = true
    
    }
    })

}


//Enviorenment Models

 const envMap = cTL.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
 ])

 envMap.encoding = THREE.sRGBEncoding
scene.background = envMap
scene.environment = envMap

debugObject.envMapIntensity = 5

gui.add(debugObject,'envMapIntensity').min(0).max(20).step(0.001).name('envMapIntensity').onChange(updateAllMaterials)



//Lights

const directionalLight = new THREE.DirectionalLight('white')
directionalLight.intensity= 5
directionalLight.position.set(4.0458,3,-2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 12
directionalLight.shadow.mapSize.set(1024,1024)
directionalLight.shadow.normalBias = 0.05 // surface shadow correction


scene.add(directionalLight)



//const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
//scene.add(directionalLightHelper)

//Debug
gui.add(directionalLight, 'intensity').min(0).max(10).step(0.0001).name('directionalLight İntensity')
gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.0001).name('Light Position X')
gui.add(directionalLight.position, 'y').min(-10).max(10).step(0.0001).name('Light Position Y')
gui.add(directionalLight.position, 'z').min(-10).max(10).step(0.0001).name('Light Position Z')








//Models

gltf.load(
    //'./models/FlightHelmet/glTF/FlightHelmet.gltf',
    './models/hamburger1.glb',
    (gltf) =>
    {

        gltf.scene.scale.set(0.3,0.3,0.3)
        gltf.scene.position.set(-3,0,2)
         gltf.scene.rotation.y= 2.270687 //Math.PI*0.5
        scene.add(gltf.scene)

        
        gui.add(gltf.scene.rotation, 'y').min(-Math.PI*2).max(Math.PI).step(0.000001).name('helmet rotation')
    
        updateAllMaterials()
    }

    
)





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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding //Enhance the lighting
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap





//Debug for renderer

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
}).onFinishChange(() =>
    {
        renderer.toneMapping = Number(renderer.toneMapping)
        updateAllMaterials()
    })





/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    //Stats
    stats.update();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()