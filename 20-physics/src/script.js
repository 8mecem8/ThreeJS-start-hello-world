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



// Sounds
const hitSound = new Audio('sounds/hit.mp3')



const playSound = (collision) =>
{

    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    console.log(collision.contact)
    if(impactStrength > 2)
    {
     hitSound.volume = Math.random()
     hitSound.currentTime = 0
     hitSound.play()
    }
}



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
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep= true
console.log(world)
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


//Utils

const objectsToUpdate = []


//Sphere
const spGeo = new THREE.SphereGeometry(0.5,20,20)// For performance improve
const spMat = new THREE.MeshStandardMaterial({// For performance improve
        metalness:0.3,
        roughness:0.4,
        envMap: environmentMapTexture
    }) 





const createSphere = (radius, position) =>
{


// Three.js Mesh

const mesh = new THREE.Mesh(
    spGeo,
    spMat
)
mesh.scale.set(radius,radius,radius)
mesh.castShadow=true
mesh.position.copy(position)
scene.add(mesh)



// Canon.js Body

const shape =new CANNON.Sphere(radius)
const body =new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0,3,0),
    shape: shape,
    material: plasticMaterial
})
body.position.copy(position)
body.timeLastSleepy = 20 // For performance improve
body.sleepSpeedLimit = 20// For performance improve
body.sleepTimeLimit = 20// For performance improve
body.addEventListener('collide', playSound)
world.add(body)


// save objects to update

objectsToUpdate.push({
    mesh: mesh,
    body: body
})



}


createSphere(0.5, { x: 0, y: 3, z: 0 })

console.log(objectsToUpdate[0].body)




//Box


// Create box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)    // For performance improve
const boxMaterial = new THREE.MeshStandardMaterial({ // For performance improve
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})
const createBox = (width, height, depth, position) =>
{
    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: plasticMaterial
    })
    body.position.copy(position)
    body.timeLastSleepy = 20 // For performance improve
    body.sleepSpeedLimit = 20// For performance improve
    body.sleepTimeLimit = 20// For performance improve
    body.addEventListener('collide', playSound)
    world.addBody(body)

    // Save in objects
    objectsToUpdate.push({ mesh, body })
}

createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 })










//Debug
const debugObject = {}

debugObject.createSphere=()=>
{
    createSphere(
       Math.random() * 0.9 * 1.1,
         {
                x:(Math.random()-0.5)* 3,
                y:2, 
                z:(Math.random()-0.5)* 4
            
         })
}






debugObject.createBox = () =>
{
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}




debugObject.reset = () =>
{
for(const object of objectsToUpdate)
    {
        // Remove body
        object.body.removeEventListener('collide', playSound)
        world.removeBody(object.body)

        // Remove mesh
        scene.remove(object.mesh)
    }

}


gui.add(debugObject,'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')






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

 // for 1 object 
 //objectsToUpdate[0].mesh.position.copy(objectsToUpdate[0].body.position)
  
 
 //For multiple Objets

 for(let x of objectsToUpdate)
 {

    x.mesh.position.copy(x.body.position)
    x.mesh.quaternion.copy(x.body.quaternion)
 }




    world.step(1/60,diffTime ,3)




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