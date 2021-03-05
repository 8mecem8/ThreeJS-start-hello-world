import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


//Fonts
const fontLoader = new THREE.FontLoader()

fontLoader.load(
    './fonts/helvetiker_regular.typeface.json',
    (font) =>
{
    alert('The font has been loaded')
    const textGeo = new THREE.TextGeometry(
        'Hello Three.js',
        {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 3,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 3
        }
    )
    textGeo.center()    

        const textMaterial = new THREE.MeshMatcapMaterial()
        textMaterial.wireframe = false
        textMaterial.matcap = mtcpTexture
        const text = new THREE.Mesh(textGeo,textMaterial)
        scene.add(text)



        const dMetarial = new THREE.MeshMatcapMaterial({matcap: textMaterial.matcap})
        const dGeo = new THREE.TorusGeometry(0.3, 0.2, 20 ,45)



console.time('donuts')

        for(let i=0;i < 170;i++)
        {

            const donut = new THREE.Mesh(dGeo,dMetarial)
               
             donut.position.x = (Math.random() - 0.5) *15
             donut.position.y = (Math.random() - 0.5) *10
             donut.position.z = (Math.random() - 0.5) *10

            donut.rotation.x = Math.random() * Math.PI 
            donut.rotation.y = Math.random() * Math.PI

            const att = Math.random()
            donut.scale.set(att,att,att)

            scene.add(donut)
        }

console.timeEnd('donuts')



}
)








/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//Axes heler

const axesHe = new THREE.AxesHelper()
scene.add(axesHe)



/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const mtcpTexture = textureLoader.load('./textures/matcaps/7.png')

/**
 * Object
 */



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
camera.position.z = 2
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