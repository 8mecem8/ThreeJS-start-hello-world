import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let cursor = 
{
    x: 0 ,
    y: 0

}

/* const setCursor = () => 
{
 document.addEventListener('mousemove', (event) => { cursor.x = event.clientX / sizes.width - 0.5, cursor.y = event.clientY / sizes.height - 0.5, console.log(cursor.x)})

 
} */
//setCursor()








/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3

scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()



//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true













let tick

(tick = () =>
{
    //console.log(camera.rotation.x)
    const elapsedTime = clock.getElapsedTime()

    //Update Camera
    /* camera.position.x = -(cursor.x) * 10
    camera.position.y = cursor.y * 10
     */

    /* camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 4
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 4
    camera.position.y = cursor.y * 7
    camera.lookAt(mesh.position) */

    //Update controls
    controls.update()

    // Update objects
    //mesh.rotation.y = elapsedTime;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
})()
