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
const gui = new dat.GUI({width:400})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
//scene.background = new THREE.Color('#6fa284');


//Galaxy


const parameters = {}
parameters.count = 1000
parameters.size = 0.02
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'








let geometry = null
let material = null
let points = null








const generateGalaxy = () =>
{

    if(points !== null)
    {
        //geometry.dispose() //did not worked , may be will work for other ones
        //material.dispose() //did not worked , may be will work for other ones
        scene.remove(points)
    }





    geometry = new THREE.BufferGeometry()
    

    const positions = new Float32Array(parameters.count*3)
    const colors = new Float32Array(parameters.count * 3)   


    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)



            for(let i=0;i<parameters.count;i++)
            {

                const i3=i*3
               // const x = [0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905,0,2.0943951023931953,4.1887902047863905]

                const radius= Math.random()*parameters.radius
                const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI*2 //galaxy arms
                const spinAngle = radius * parameters.spin


                const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
                const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
                const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

                // if(i < 20)
                // {
                //     console.log(branchAngle)
                // }






                const mixedColor = colorInside.clone()
                mixedColor.lerp(colorOutside, radius / parameters.radius)






                colors[i3 + 0] = mixedColor.r
                colors[i3 + 1] = mixedColor.g
                colors[i3 + 2] = mixedColor.b



                



                positions[i3+0] =Math.cos(branchAngle+spinAngle)* radius + randomX    //(Math.random()-0.5)*4
                positions[i3+1] = randomY                                      //(Math.random()-0.5)*4
                positions[i3+2] =Math.sin(branchAngle+spinAngle)* radius + randomZ    //(Math.random()-0.5)*4

            }





            
    geometry.setAttribute
    (
        'position',
        new THREE.BufferAttribute(positions, 3)
    )







    geometry.setAttribute
    (
        'color',
        new THREE.BufferAttribute(colors, 3)
    )


    //Material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite:false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })






    //Points
    points = new THREE.Points(geometry,material)
    scene.add(points)
}




generateGalaxy()





//Debug

gui.add(parameters,'count').min(100).max(50000).step(50).name('Galaxy Partical Numbers').onFinishChange(generateGalaxy)
gui.add(parameters,'size').min(0.001).max(2).step(0.010).name('Galaxy Partical Size').onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).name('Galaxy Partical Radius').onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(1).max(20).step(1).name('Galaxy Branches').onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).name('Galaxy Spin').onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).name('Galaxy Randomness').onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)





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
camera.position.x = 3
camera.position.y = 3
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)


    //Update Stats
    stats.update();
    
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()