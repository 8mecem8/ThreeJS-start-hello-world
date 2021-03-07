import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module.js'




//Stats
let stats = new Stats()
document.body.appendChild( stats.dom );


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#6fa284');

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const parTex= textureLoader.load('./textures/particles/cake.png')

//Particles


//Geometry

//const parGeo = new THREE.SphereGeometry(1,32,32)

const parGeo = new THREE.BufferGeometry()
const count = 50000


const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

console.log(parGeo)

for(let i=0;i<count * 3;i++)
{
    positions[i]= (Math.random() - 0.5) * 21
    colors[i]= Math.random()

}

parGeo.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)


parGeo.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)




//Material
const parMat = new THREE.PointsMaterial({
    size:0.4,
    sizeAttenuation: true // Size changes according to camera distance
})

//parMAt.size = 0.02
//parMat.sizeAttenuation = true
//parMat.color=new THREE.Color('blue')
parMat.map = parTex
parMat.transparent=true
//parMat.alphaMap = parTex  //if the background color is black of png use this
parMat.alphaTest = 0.001 //good for fixing render errors
//parMat.depthTest = false //good for fixing render errors but makes transparent objects
//parMat.depthWrite = false //good for fixing render errors but makes transparent objects
//parMat.blending = THREE.AdditiveBlending //good for fixing render errors
parMat.vertexColors = true



//Points

const particles = new THREE.Points(parGeo,parMat)
scene.add(particles)





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
    renderer.setClearColor('white')
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update particals

    // const a = (Math.random()-0.5)*15
    // particles.position.x = Math.sin(elapsedTime*0.4)
    // particles.position.y = a* 0.0001
    // particles.position.z = Math.cos(elapsedTime*0.4)

particles.rotation.z = Math.sin(elapsedTime * 0.1)
particles.rotation.x = Math.cos(elapsedTime * 0.1)

    
    for(let i=0;i<count;i++)
 {
    const i3 = i * 3

    
     const a = (Math.random()-0.5)*15
    // parGeo.attributes.position.array[i3 + 1] = Math.sin(a) * 3 
    // parGeo.attributes.position.array[i3 + 2] = Math.cos(a)  //elipse tunnel


   
 }


parGeo.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

stats.update();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()